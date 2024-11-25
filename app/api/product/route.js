import { ScanCommand } from "@aws-sdk/lib-dynamodb";
import { ddbDocClient } from "@/config/docClient";
import { NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import formidable from "formidable";
import fs from "fs";
import getRawBody from "raw-body";
import { Readable } from "stream";

export const runtime = "nodejs"; // Ensure Node.js runtime is used
export const config = {
  api: {
    bodyParser: false, // Disable default body parsing by Next.js
  },
};

const s3 = new S3Client();

// Convert Buffer to Readable Stream
function bufferToStream(buffer, headers) {
  const stream = new Readable();
  stream._read = () => {}; // No-op
  stream.push(buffer);
  stream.push(null); // End the stream
  stream.headers = headers; // Attach headers for formidable
  return stream;
}

export async function POST(req) {
  try {
    // Get raw body as a buffer
    const rawBody = await getRawBody(req, {
      length: req.headers["content-length"], // Required by raw-body
      limit: "10mb", // Set appropriate limit
      encoding: null, // Keep raw buffer
    });

    // Convert buffer to a readable stream
    const nodeReq = bufferToStream(rawBody, req.headers);

    // Use formidable to parse the form
    const form = formidable({
      multiples: true, // Allow multiple file uploads
      keepExtensions: true, // Keep file extensions
    });

    return new Promise((resolve, reject) => {
      // Parse the request using formidable
      form.parse(nodeReq, async (err, fields, files) => {
        if (err) {
          console.error("Error parsing form:", err);
          return resolve(
            new Response(JSON.stringify({ error: "Error processing form" }), {
              status: 500,
            })
          );
        }

        try {
          console.log("Fields received:", fields);

          // Upload files to S3
          const uploadPromises = Object.values(files).map(async (file) => {
            const fileContent = fs.readFileSync(file.filepath);

            const command = new PutObjectCommand({
              Bucket: process.env.AWS_S3_BUCKET,
              Key: `products/${fields.prod_id}/${file.originalFilename}`,
              Body: fileContent,
              ContentType: file.mimetype,
            });

            return s3.send(command);
          });

          const results = await Promise.all(uploadPromises);

          return resolve(
            new Response(
              JSON.stringify({
                message: "Files uploaded successfully",
                fields,
                results,
              }),
              { status: 200 }
            )
          );
        } catch (uploadError) {
          console.error("Error uploading files:", uploadError);
          return resolve(
            new Response(JSON.stringify({ error: "Error uploading files" }), {
              status: 500,
            })
          );
        }
      });
    });
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
