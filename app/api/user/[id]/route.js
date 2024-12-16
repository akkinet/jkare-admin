import { NextResponse } from "next/server";
import { ddbDocClient } from "@/config/docClient";
import { DeleteCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";

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

export const PUT = async(req, ctx) => {
  const updates = await req.json();
  const email = (await ctx.params).id;
  // Construct the UpdateExpression dynamically
  let updateExpression = "SET ";
  const expressionAttributeValues = {};
  const expressionAttributeNames = {};
  let first = true;

  for (const key in updates) {
      if (updates[key] !== undefined) {
          const attributeName = `#${key}`;
          const attributeValue = `:${key}`;
          updateExpression += `${first ? "" : ", "}${attributeName} = ${attributeValue}`;
          expressionAttributeNames[attributeName] = key;
          expressionAttributeValues[attributeValue] = updates[key];
          first = false;
      }
  }

  if (first) {
      throw new Error("No valid fields to update");
  }

  try{
    const params = {
      TableName: "AdminUsers",
      Key: {
          email, // Partition key
      },
      UpdateExpression: updateExpression,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
      ReturnValues: "ALL_NEW", // To get the updated record
  };

  const result = await ddbDocClient.send(new UpdateCommand(params));
  console.log("Record updated successfully:", result.Attributes);
  return NextResponse.json(result.Attributes);
  }catch(error){
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500});
  }
}