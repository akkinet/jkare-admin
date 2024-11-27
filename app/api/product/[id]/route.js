import { NextResponse } from "next/server";
import { ddbDocClient } from "@/config/docClient";
import { UpdateCommand } from "@aws-sdk/lib-dynamodb";

// Define the table name
const TableName = "RealProducts";

export const PUT = async (req, ctx) => {
  try {
    const { id } = await ctx.params;
    // Parse the request body
    const updatedFields = await req.json();

    if (!updatedFields || typeof updatedFields !== "object") {
      return NextResponse.json(
        { error: "Invalid request body. 'updatedFields' are required." },
        { status: 400 }
      );
    }

    // Dynamically construct the UpdateExpression and ExpressionAttributeValues
    let UpdateExpression = "SET";
    const ExpressionAttributeValues = {};
    const ExpressionAttributeNames = {};

    Object.keys(updatedFields).forEach((field, index) => {
      const placeholder = `#field${index}`;
      const valuePlaceholder = `:value${index}`;

      // Add to UpdateExpression
      UpdateExpression += ` ${placeholder} = ${valuePlaceholder},`;

      // Add to ExpressionAttributeValues and ExpressionAttributeNames
      ExpressionAttributeValues[valuePlaceholder] = updatedFields[field];
      ExpressionAttributeNames[placeholder] = field;
    });

    // Remove trailing comma from UpdateExpression
    UpdateExpression = UpdateExpression.slice(0, -1);

    // Execute the update command
    const result = await ddbDocClient.send(
      new UpdateCommand({
        TableName,
        Key: { prod_id: parseInt(id) }, // Primary key
        UpdateExpression,
        ExpressionAttributeValues,
        ExpressionAttributeNames,
        ReturnValues: "ALL_NEW", // Return the updated item
      })
    );

    return NextResponse.json(
      { message: "Update succeeded", updatedProduct: result.Attributes },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
