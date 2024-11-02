import { QueryCommand } from "@aws-sdk/lib-dynamodb";
import { ddbDocClient } from "@/config/docClient";
import { NextResponse } from "next/server";

export const GET = async (req, ctx) => {
  try {
    let command;

      const params = {
        TableName: "Orders",
        KeyConditionExpression: "customer_email = :email",
        ExpressionAttributeValues: {
          ":email": email,
        },
      };
      command = new QueryCommand(params);
    
    const result = await ddbDocClient.send(command);
    let orderList = [];
    if (result.Items.length > 0) orderList = result.Items;

    return NextResponse.json(orderList, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
