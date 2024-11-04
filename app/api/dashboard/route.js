import { ScanCommand } from "@aws-sdk/lib-dynamodb";
import { ddbDocClient } from "@/config/docClient";
import { NextResponse } from "next/server";

function formatDate(date) {
  const options = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  };

  return date.toLocaleString("en-US", options);
}

export const GET = async (req, ctx) => {
  try {
    const { searchParams } = new URL(req.url);
    const today = new Date();
    let from;

    if (searchParams.size > 0) from = searchParams.get("from");
    else from = formatDate(new Date(`01/01/${today.getFullYear()}`));

    const to = formatDate(today);

    console.log("date", from, to);
    const params = {
      TableName: "Orders",
      FilterExpression: "#od BETWEEN :start AND :end",
      ExpressionAttributeNames: {
        "#od": "order_date",
      },
      ExpressionAttributeValues: {
        ":start": from,
        ":end": to
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
