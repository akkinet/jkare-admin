import { NextResponse } from 'next/server';
import sendMail from '@/config/nodeMailer';
import db from "@/lib/mongodb"
import { ObjectId } from 'mongodb';

export const PUT = async (req, ctx) => {
  try {
    const id = (await ctx.params).id;
    const { status, remark, email } = await req.json();

    // Connect to MongoDB
    const ordersCollection = db.collection('Order');

    // Prepare the update object
    const update = {
      $set: {
        order_status: status,
      },
    };

    // Add remark to the update if the status is "Cancelled"
    if (status === "Cancelled") {
      update.$set.remark = remark;

      // Send email
      const html = `<p>${remark.msg}</p>`;
      await sendMail(email, remark.sub, html);
    }

    // Update the order in MongoDB
    await ordersCollection.findOneAndUpdate(
      { _id: new ObjectId(id) }, // Filter by order ID
      update, // Update object
      { returnDocument: 'after' } // Return the updated document
    );

    return NextResponse.json({ message: "updated" }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};