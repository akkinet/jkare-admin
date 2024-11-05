import { NextResponse } from "next/server";
import {
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";
import { ddbDocClient } from "@/config/docClient";
import sendMail from "@/config/nodeMailer";

export const PUT = async (req, ctx) => {
  try {
    const id = (await ctx.params).id;
    const { status, remark, email } = await req.json();
    const params = {
      TableName: "Orders",
      Key: { id },
      UpdateExpression: `SET #ostat = :newstat`,
      ExpressionAttributeNames: {
        "#ostat": "order_status",
      },
      ExpressionAttributeValues: {
        ":newstat": status,
      },
      ReturnValues: "UPDATED_NEW",
    };

    if(status == "Cancelled"){
      params.ExpressionAttributeValues[":remark"] = remark;
      params.UpdateExpression += ", remark = :remark";

      const html = `<p>${remark.msg}</p>`;
      await sendMail(email, remark.sub, html);
    }

    await ddbDocClient.send(new UpdateCommand(params));

    return NextResponse.json({ message: "updated" }, {status: 200});
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
