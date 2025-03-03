import { NextResponse } from "next/server";
import db from "@/lib/mongodb";

export const GET = async (req, ctx) => {
  try {
    const { searchParams } = new URL(req.url);
    let year;

    // Get the year from query parameters or default to the current year
    if (searchParams.size > 0) {
      year = searchParams.get("year");
    } else {
      const today = new Date();
      year = today.getFullYear().toString();
    }

    // Connect to MongoDB
    const ordersCollection = db.collection("Order");

    // Match orders for the specified year
    const matchStage = {
      $match: {
        order_date: {
          $regex: year, // Match orders where order_date starts with the specified year
        },
      },
    };

    // Group by month and calculate statistics
    const groupStage = {
      $group: {
        _id: { $month: { $toDate: "$order_date" } }, // Extract month from order_date
        totalOrders: { $sum: 1 },
        totalSales: { $sum: { $toDouble: "$total_amount" } },
        completedOrders: {
          $sum: {
            $cond: [{ $eq: ["$order_status", "Completed"] }, 1, 0],
          },
        },
        pendingPrescription: {
          $sum: {
            $cond: [{ $eq: ["$prescription_status", "Pending"] }, 1, 0],
          },
        },
      },
    };

    // Sort by month
    const sortStage = {
      $sort: { _id: 1 }, // Sort by month (1-12)
    };

    // Execute the aggregation pipeline
    const stats = await ordersCollection
      .aggregate([matchStage, groupStage, sortStage])
      .toArray();

    // Initialize arrays for orders and sales by month
    const ordersByMonth = new Array(12).fill(0);
    const salesByMonth = new Array(12).fill(0);

    // Populate the arrays with aggregated data
    stats.forEach((monthData) => {
      const monthIndex = monthData._id - 1; // Convert month (1-12) to array index (0-11)
      ordersByMonth[monthIndex] = monthData.totalOrders;
      salesByMonth[monthIndex] = monthData.totalSales;
    });

    // Calculate total metrics
    const totalOrders = stats.reduce(
      (sum, monthData) => sum + monthData.totalOrders,
      0
    );
    const completedOrders = stats.reduce(
      (sum, monthData) => sum + monthData.completedOrders,
      0
    );
    const pendingPrescription = stats.reduce(
      (sum, monthData) => sum + monthData.pendingPrescription,
      0
    );
    const totalSales = stats.reduce(
      (sum, monthData) => sum + monthData.totalSales,
      0
    );

    return NextResponse.json(
      {
        stats: {
          orders: ordersByMonth,
          sales: salesByMonth,
        },
        completedOrders,
        pendingPrescription,
        totalOrders,
        totalSales,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
