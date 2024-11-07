import { ScanCommand } from "@aws-sdk/lib-dynamodb";
import { ddbDocClient } from "@/config/docClient";
import { NextResponse } from "next/server";

export const GET = async (req) => {
  try {
    const { searchParams } = new URL(req.url);
    const pStat = searchParams.get("pstat");
    const oStat = searchParams.get("ostat");
    let params;

    if(pStat && oStat){
      params = {
        TableName: "Orders",
        FilterExpression: "#os = :os AND #ps = :ps",
        ExpressionAttributeNames: {
          "#ps": "prescription_status",
          "#os": "order_status",
        },
        ExpressionAttributeValues: {
          ":ps": pStat,
          ":os": oStat,
        },
      };
    }else{
      params = {
        TableName: "Orders",
        FilterExpression: "#os = :os AND #ps IN (:ps1, :ps2)",
        ExpressionAttributeNames: {
          "#ps": "prescription_status",
          "#os": "order_status",
        },
        ExpressionAttributeValues: {
          ":ps1": "Pending",
          ":os": "Pending",
          ":ps2": "Received",
        },
      };
    }

    const command = new ScanCommand(params);

    const result = await ddbDocClient.send(command);

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
