import { NextResponse } from "next/server";
import { ddbDocClient } from "@/config/docClient";
import { DeleteCommand } from "@aws-sdk/lib-dynamodb";

export const DELETE = async (req, ctx) => {
  try{
    await ddbDocClient.send(new DeleteCommand({
      TableName: "AdminUsers",
      Key: { email: (await ctx.params).id }
    }))

    return NextResponse.json({ message: 'User deleted successfully' });
  }catch(error){
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500});
  }
}