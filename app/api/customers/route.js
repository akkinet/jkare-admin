import { NextResponse } from "next/server";
import { ddbDocClient } from "@/config/docClient";
import { ScanCommand } from "@aws-sdk/lib-dynamodb";

export const GET = async (req) => {
  try {
    const params = {
      TableName: "Users",
    };

    const result = await ddbDocClient.send(new ScanCommand(params));
    let customers = result.Count ? result.Items : [];

    for(const customer of customers) {
      const orders = await fetch(`${process.env.API_URL}/order?email=${customer.email}&os=Completed`);
      const result2 = await orders.json();
      customer.totalOrders = result2.length;
      customer.totalSales = result2.reduce((sum, order) => sum + parseFloat(order.total_amount), 0);
    }

    // Sort customers by total sales in descending order    
    customers.sort((a, b) => b.totalSales - a.totalSales);

    // Remove sensitive information from the response
    customers.forEach((customer) => {
      delete customer.password;
      delete customer.createdAt;
      delete customer.address;
      delete customer.image;
      delete customer.verified;
      delete customer.updatedAt;
    });

    return NextResponse.json(customers);
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
