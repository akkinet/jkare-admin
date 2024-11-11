import { ScanCommand } from "@aws-sdk/lib-dynamodb";
import { ddbDocClient } from "@/config/docClient";
import { NextResponse } from "next/server";

export const GET = async (req, ctx) => {
  try {
    const { searchParams } = new URL(req.url);
    let year;

    if (searchParams.size > 0) {
      year = searchParams.get("year");
    } else {
      const today = new Date();
      year = today.getFullYear().toString();
    }

    const params = {
      TableName: "Orders",
      FilterExpression: "contains(#od, :year)",
      ExpressionAttributeNames: {
        "#od": "order_date",
      },
      ExpressionAttributeValues: {
        ":year": year,
      },
    };

    const command = new ScanCommand(params);

    const result = await ddbDocClient.send(command);
    let completedOrders = 0,
      pendingPrescription = 0,
      totalOrders = 0,
      totalSales = 0;
    const stats = {
      orders: new Array(12).fill(0),
      sales: new Array(12).fill(0),
    };
    if (result.Count > 0) {
      const orderList = result.Items;
      for (const order of orderList) {
        const orderDate = new Date(order.order_date);
        stats.orders[orderDate.getMonth() - 1]++;
        stats.sales[orderDate.getMonth() - 1] += parseFloat(order.total_amount);
      }
      totalOrders = result.Count;
      completedOrders = orderList.filter(
        (order) => order.order_status == "Completed"
      ).length;
      pendingPrescription = orderList.filter(
        (order) => order.prescription_status == "Pending"
      ).length;
      totalSales = orderList.reduce(
        (total, order) => total + parseFloat(order.total_amount),
        0
      );
    }

    return NextResponse.json(
      { stats, completedOrders, pendingPrescription, totalOrders, totalSales },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
