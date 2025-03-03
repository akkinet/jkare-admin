import { NextResponse } from "next/server";
import { DeleteCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { ddbDocClient } from "@/config/docClient";

export const PUT = async (req, ctx) => {
  try {
    const updateData = await req.json();
    const { id } = await ctx.params;

    const vendorsCollection = db.collection('VendorAlt');

    // Update the vendor in MongoDB
    const result = await vendorsCollection.findOneAndUpdate(
      { _id: id }, // Filter by vendor ID
      { $set: updateData }, // Update fields
      { returnDocument: 'after' } // Return the updated document
    );

    if (!result) {
      return NextResponse.json(
        { error: 'Vendor not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("DynamoDB Error", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};

export const DELETE = async (req, ctx) => {
  try{
    const { id } = await ctx.params;
    const vendorsCollection = db.collection('VendorAlt');

    // Delete the vendor from MongoDB
    const result = await vendorsCollection.findOneAndDelete({ _id: id });

    if (!result) {
      return NextResponse.json(
        { error: 'Vendor not found' },
        { status: 404 }
      );
    }
    return NextResponse.json({ message: 'Item deleted successfully' });
  } catch (error) {
    console.error("DynamoDB Error", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}