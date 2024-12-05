import { NextResponse } from "next/server";
import { DeleteCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { ddbDocClient } from "@/config/docClient";

export const PUT = async (req, ctx) => {
  try {
    const updateData = await req.json();
    const { id } = await ctx.params;

    let updateExpression = "set ";
    let expressionAttributeNames = {};
    let expressionAttributeValues = {};

    // Build the update expression dynamically based on provided fields
    Object.entries(updateData).forEach(([key, value], index, array) => {
      // Use a placeholder for the attribute name to avoid reserved keyword conflicts
      const attributeNamePlaceholder = `#${key}`;
      const attributeValuePlaceholder = `:${key}`;

      // Add to the update expression
      updateExpression += `${attributeNamePlaceholder} = ${attributeValuePlaceholder}`;
      // Add a comma if it's not the last item
      if (index < array.length - 1) updateExpression += ", ";

      // Populate the attribute names and values
      expressionAttributeNames[attributeNamePlaceholder] = key;
      expressionAttributeValues[attributeValuePlaceholder] = value;
    });

    const params = {
      TableName: "VendorAlt",
      Key: { id },
      UpdateExpression: updateExpression,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
      ReturnValues: "ALL_NEW",
    };

    const data = await ddbDocClient.send(new UpdateCommand(params));
    return NextResponse.json(data);
  } catch (error) {
    console.error("DynamoDB Error", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};

export const DELETE = async (req, ctx) => {
  try{
    const { id } = await ctx.params;
    const params = {
      TableName: "VendorAlt", 
      Key: { id }
    };

    await ddbDocClient.send(new DeleteCommand(params));
    return NextResponse.json({ message: 'Item deleted successfully' });
  } catch (error) {
    console.error("DynamoDB Error", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}