import { NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import db from "@/lib/mongodb"

// Initialize AWS S3 client
const s3Client = new S3Client();
const BUCKET_NAME = process.env.AWS_S3_BUCKET;

export async function POST(req) {
  try {
    const { prod_images, ...body } = await req.json();
    const uploadedImages = [];

    // Upload images to S3
    for (const image of prod_images) {
      const { fileName, filePreview, fileType } = image;
      const fileBuffer = Buffer.from(filePreview.split(',')[1], 'base64');
      const lastDot = fileName.lastIndexOf('.');
      const file_name = fileName.slice(0, lastDot);
      const extension = fileName.slice(lastDot + 1);
      const newFileName = `products/${
        body.prod_id
      }/${file_name}_${new Date().getTime()}.${extension}`;

      const params = {
        Bucket: BUCKET_NAME,
        Key: newFileName,
        Body: fileBuffer,
        ContentType: fileType,
      };

      await s3Client.send(new PutObjectCommand(params));
      uploadedImages.push(
        `https://s3.${process.env.AWS_REGION}.amazonaws.com/${BUCKET_NAME}/${newFileName}`
      );
    }

    const productsCollection = db.collection('RealProducts');
    const categoriesCollection = db.collection('RealCategories');

    // Insert product into MongoDB
    const product = { ...body, prod_images: uploadedImages };
    await productsCollection.insertOne(product);

    // Insert category if it starts with "#"
    if (body.category.startsWith('#')) {
      const category = {
        name: body.category.slice(1),
        image: uploadedImages[0],
      };
      await categoriesCollection.insertOne(category);
    }

    return NextResponse.json(
      { msg: 'Product inserted successfully' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Request handling error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export const GET = async (req) => {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('query');

    const productsCollection = db.collection('Products');

    // Build the query
    const filter = {};
    if (query && query.trim()) {
      filter.$or = [
        { prod_name: { $regex: query, $options: 'i' } }, // Case-insensitive search
        { prod_name: { $regex: query[0].toUpperCase() + query.slice(1), $options: 'i' } },
      ];
    }

    // Fetch products from MongoDB
    const products = await productsCollection.find(filter).toArray();

    // Extract unique brands, categories, and vendors
    const brands = [...new Set(products.map((item) => item.brand_name))];
    const categories = [...new Set(products.map((item) => item.category))];
    const vendors = [...new Set(products.map((item) => item.vendor_name))];

    return NextResponse.json(
      { products, brands, categories, vendors },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};