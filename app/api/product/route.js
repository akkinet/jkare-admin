import { ScanCommand } from "@aws-sdk/lib-dynamodb";
import { ddbDocClient } from "@/config/docClient";
import { NextResponse } from "next/server";

export const GET = async (req) => {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query");
    let params = {
      TableName: "RealProducts",
    };
    if (query && query.trim())
      params = {
        ...params,
        FilterExpression: "contains(#name, :val) OR contains(#name, :alt)",
        ExpressionAttributeNames: {
          "#name": "prod_name",
        },
        ExpressionAttributeValues: {
          ":val": query,
          ":alt": query[0].toUpperCase() + query.slice(1)
        },
      };

    const command = new ScanCommand(params);

    const result = await ddbDocClient.send(command);
    const products = result.Count > 0 ? result.Items : [];

    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
