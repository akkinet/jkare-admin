import { NextResponse } from "next/server";
// import { ddbDocClient } from "@/config/docClient";
// import { PutCommand } from "@aws-sdk/lib-dynamodb";
// import {v4 as uuidv4} from 'uuid';

export const GET = async (req) => {
  try {
    const res = await fetch(`${process.env.CLIENT_SERVER_API}/product`);

    const products = await res.json();

    let vendors = products.map((p) => p.vendor_name);

    vendors = new Set(vendors);

    vendors = Array.from(vendors);

    // for(const vendor of vendors){
    //   const params = {
    //     TableName: "Vendors",
    //     Item: {
    //       id: uuidv4(),
    //       name: vendor
    //     },
    //   };
  
    //   await ddbDocClient.send(new PutCommand(params));
    // }

    return NextResponse.json(vendors, { status: 200 });
  } catch (error) {
    console.error(error);

    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
