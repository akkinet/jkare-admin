import { ScanCommand } from "@aws-sdk/lib-dynamodb";
import { ddbDocClient } from "@/config/docClient";
import { NextResponse } from "next/server";

export const GET = async (req) => {
  try {
    let params = {
      TableName: "AdminUsers",
    };

    const command = new ScanCommand(params);

    const result = await ddbDocClient.send(command);
    const users = result.Count > 0 ? result.Items : [];

    return NextResponse.json(
      users,
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
