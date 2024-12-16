import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { ddbDocClient } from "@/config/docClient";
import {
  GetCommand,
  QueryCommand,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";
import { NextResponse } from "next/server";

// Initialize AWS clients
const s3Client = new S3Client();
const BUCKET_NAME = process.env.AWS_S3_BUCKET;

export async function PUT(req, ctx) {
  try {
    const orderId = (await ctx.params).id;
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json(
        { error: "File is required" },
        { status: 400 }
      );
    }

    // Generate unique filename and upload to S3
    const lastDot = file.name.lastIndexOf(".");
    const file_name = file.name.slice(0,lastDot);
    const extension = file.name.slice(lastDot + 1);
    const fileName = `px&inc/${file_name}_${orderId}.${extension}`;
    const uploadParams = {
      Bucket: BUCKET_NAME,
      Key: fileName,
      Body: await file.arrayBuffer(),
      ContentType: file.type,
    };

    await s3Client.send(new PutObjectCommand(uploadParams));
    const fileUrl = `https://s3.${process.env.AWS_REGION}.amazonaws.com/${BUCKET_NAME}/${fileName}`;

    // Retrieve the existing order data
    const getItemParams = {
      TableName: "Orders",
      Key: { id: orderId },
    };

    const getItemCommand = new GetCommand(getItemParams);
    const { Item } = await ddbDocClient.send(getItemCommand);

    if (!Item) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    // Update all items in the 'items' array
    const updatedItems = Item.items.map((item) => ({
      ...item,
      prescription_file: fileUrl
    }));

    // Update DynamoDB record with file URL
    const updateParams = new UpdateCommand({
      TableName: "Orders",
      Key: { id: orderId },
      UpdateExpression: "SET #items = :updatedItems, prescription_status = :status",
      ExpressionAttributeNames: {
        "#items": "items",
      },
      ExpressionAttributeValues: {
        ":updatedItems": updatedItems,
        ":status": "Received",
      },
      ReturnValues: "ALL_NEW",
    });

    const updateResponse = await ddbDocClient.send(updateParams);

    return NextResponse.json({
      message: "File uploaded and order updated successfully",
      fileUrl,
      updatedAttributes: updateResponse.Attributes,
    });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Failed to upload file or update order", details: error.message },
      { status: 500 }
    );
  }
}
