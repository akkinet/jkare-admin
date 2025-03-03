import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import db from "@/lib/mongodb"
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
      return NextResponse.json({ error: "File is required" }, { status: 400 });
    }

    // Generate unique filename and upload to S3
    const lastDot = file.name.lastIndexOf(".");
    const file_name = file.name.slice(0, lastDot);
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

    const ordersCollection = db.collection("Order");

    // Retrieve the existing order data
    const order = await ordersCollection.findOne({ _id: orderId });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Update all items in the 'items' array
    const updatedItems = order.items.map((item) =>
      item.prescription_required
        ? { ...item, prescription_file: fileUrl }
        : item
    );

    // Update MongoDB record with file URL
    await ordersCollection.findOneAndUpdate(
      { _id: orderId },
      {
        $set: {
          items: updatedItems,
          prescription_status: "Received",
        },
      },
      { returnDocument: "after" } // Return the updated document
    );

    return NextResponse.json({
      message: "File uploaded and order updated successfully",
      fileUrl,
      updatedAttributes: updateResponse.Attributes,
    });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      {
        error: "Failed to upload file or update order",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
