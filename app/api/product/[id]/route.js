import { NextResponse } from 'next/server';
import db from "@/lib/mongodb";

// Define the collection name
const COLLECTION_NAME = 'RealProducts';

export const PUT = async (req, ctx) => {
  try {
    const { id } = await ctx.params;
    // Parse the request body
    const updatedFields = await req.json();

    if (!updatedFields || typeof updatedFields !== 'object') {
      return NextResponse.json(
        { error: "Invalid request body. 'updatedFields' are required." },
        { status: 400 }
      );
    }

    const productsCollection = db.collection(COLLECTION_NAME);

    // Update the product in MongoDB
    const result = await productsCollection.findOneAndUpdate(
      { _id: id }, // Filter by product ID
      { $set: updatedFields }, // Update fields
      { returnDocument: 'after' } // Return the updated document
    );

    if (!result) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'Update succeeded', updatedProduct: result },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};