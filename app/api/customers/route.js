import { NextResponse } from "next/server";
import db from "@/lib/mongodb";

export const GET = async (req) => {
  try {
    // Fetch all users
    const collection = db.collection("Users")
    let customers = await collection.find({}, {
      projection: {
        password: 0,
        createdAt: 0,
        address: 0,
        image: 0,
        verified: 0,
        updatedAt: 0,
      },
    }).toArray();

    // Fetch all completed orders for all customers in parallel
    const ordersPromises = customers.map(async (customer) => {
      try {
        const ordersResponse = await fetch(`${process.env.API_URL}/order?email=${customer.email}&os=Completed`);
        const orders = await ordersResponse.json();
        return { email: customer.email, orders };
      } catch (error) {
        console.error(`Failed to fetch orders for ${customer.email}:`, error);
        return { email: customer.email, orders: [] }; // Return empty array if API call fails
      }
    });

    const ordersResults = await Promise.all(ordersPromises);

    // Map orders to customers
    const ordersMap = new Map();
    ordersResults.forEach((result) => {
      ordersMap.set(result.email, result.orders);
    });

    // Calculate totalOrders and totalSales for each customer
    customers.forEach((customer) => {
      const orders = ordersMap.get(customer.email) || [];
      customer.totalOrders = orders.length;
      customer.totalSales = orders.reduce((sum, order) => sum + parseFloat(order.total_amount || 0), 0);
    });

    // Sort customers by total sales in descending order
    customers.sort((a, b) => b.totalSales - a.totalSales);

    return NextResponse.json(customers);
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
