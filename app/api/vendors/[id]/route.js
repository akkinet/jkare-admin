import { NextResponse } from "next/server";
import {
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";
import { ddbDocClient } from "@/config/docClient";

export const PUT = async (req, ctx) => {
  try{
    const params = {
      TableName: "Vendors",
      Key: { id: ctx.params.id },
      UpdateExpression: `SET #ostat = :newstat`,
      ExpressionAttributeNames: {
        "#ostat": "order_status",
      },
      ExpressionAttributeValues: {
        ":newstat": status,
      },
      ReturnValues: "UPDATED_NEW",
    };
    await ddbDocClient.send(new UpdateCommand(params));
    return NextResponse.json({msg: "ok"});
  }catch(error){
    console.error(error);
    return NextResponse.json({error: error.message}, {status: 500})
  }
}