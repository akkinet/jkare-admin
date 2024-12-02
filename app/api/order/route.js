import { NextResponse } from "next/server";
import {
  ScanCommand
} from "@aws-sdk/lib-dynamodb";
import { ddbDocClient } from "@/config/docClient";

export const GET = async (req, ctx) => {
  try {
    const params = {
      TableName: "Orders",
    };


    const result = await ddbDocClient.send(new ScanCommand(params));
    const orders = result.Count ? result.Items : [];

    return NextResponse.json(orders, {status: 200});
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
