import { ScanCommand } from "@aws-sdk/lib-dynamodb";
import { ddbDocClient } from "@/config/docClient";
import { NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { PutCommand } from "@aws-sdk/lib-dynamodb";

export async function POST(req) {
  try {
    const { prod_images, ...body } = await req.json();
    const uploadedImages = [];
    for (const image of prod_images) {
      const { fileName, filePreview, fileType } = image;
      const fileBuffer = Buffer.from(filePreview.split(",")[1], "base64");
      const lastDot = fileName.lastIndexOf(".");
      const file_name = fileName.slice(0, lastDot);
      const extension = fileName.slice(lastDot + 1);
      const newFileName = `products/${
        body.prod_id
      }/${file_name}_${new Date().getTime()}.${extension}`;
      const s3 = new S3Client();
      const params = {
        Bucket: "medicom.hexerve",
        Key: newFileName,
        Body: fileBuffer,
        ContentType: fileType,
      };
      await s3.send(new PutObjectCommand(params));
      uploadedImages.push(
        `https://s3.${process.env.AWS_REGION}.amazonaws.com/${process.env.AWS_S3_BUCKET}/${newFileName}`
      );
    }

    const params = {
      TableName: "RealProducts",
      Item: {...body, prod_images: uploadedImages},
    };
    const command = new PutCommand(params);
    await ddbDocClient.send(command);
    return NextResponse.json({ msg: "Product inserted successfully" }, { status: 201 });
  } catch (error) {
    console.error("Request handling error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}

export const GET = async (req) => {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query");
    let params = {
      TableName: "RealProducts",
    };
    if (query && query.trim())
      params = {
        ...params,
        FilterExpression: "contains(#name, :val) OR contains(#name, :alt)",
        ExpressionAttributeNames: {
          "#name": "prod_name",
        },
        ExpressionAttributeValues: {
          ":val": query,
          ":alt": query[0].toUpperCase() + query.slice(1),
        },
      };

    const command = new ScanCommand(params);

    const result = await ddbDocClient.send(command);
    const products = result.Count > 0 ? result.Items : [];
    const brands =
      result.Count > 0
        ? Array.from(new Set(result.Items.map((item) => item.brand_name)))
        : [];
    const categories =
      result.Count > 0
        ? Array.from(new Set(result.Items.map((item) => item.category)))
        : [];
    const vendors =
      result.Count > 0
        ? Array.from(new Set(result.Items.map((item) => item.vendor_name)))
        : [];

    return NextResponse.json(
      { products, brands, categories, vendors },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
