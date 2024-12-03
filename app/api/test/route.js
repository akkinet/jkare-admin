import { NextResponse } from "next/server";
import { BatchWriteCommand } from "@aws-sdk/lib-dynamodb";
import { ddbDocClient } from "@/config/docClient";

const items = [
  {
    phoneNumber: "(757) 972-3293",
    address: "291 Example Street, City 7, State CA",
    contactName: "contact 7",
    id: "JK-107",
    email: "contact7@example.com",
    name: "AffloVest",
  },
  {
    phoneNumber: "(822) 483-9719",
    address: "579 Example Street, City 11, State FL",
    contactName: "contact 11",
    id: "JK-111",
    email: "contact11@example.com",
    name: "Fisher & Paykel Healthcare",
  },
  {
    phoneNumber: "(729) 982-1820",
    address: "261 Example Street, City 8, State NY",
    contactName: "contact 8",
    id: "JK-108",
    email: "contact8@example.com",
    name: "Percussionaire",
  },
  {
    phoneNumber: "(461) 823-5786",
    address: "609 Example Street, City 10, State TX",
    contactName: "contact 10",
    id: "JK-110",
    email: "contact10@example.com",
    name: "Rhythm Medical",
  },
  {
    phoneNumber: "(246) 900-6532",
    address: "113 Example Street, City 1, State TX",
    id: "JK-101",
    contactName: "Contact 1",
    email: "contact1@example.com",
    name: "Radiometer",
  },
  {
    phoneNumber: "(249) 704-1404",
    address: "596 Example Street, City 3, State CA",
    contactName: "contact 3",
    id: "JK-103",
    email: "contact3@example.com",
    name: "Oxygen Concentrator Store",
  },
  {
    phoneNumber: "(451) 352-1744",
    address: "345 Example Street, City 5, State TX",
    contactName: "Contact 5",
    id: "JK-105",
    email: "contact5@example.com",
    name: "3B Medical",
  },
  {
    phoneNumber: "(432) 905-6235",
    address: "187 Example Street, City 4, State NY",
    contactName: "contact 4",
    id: "JK-104",
    email: "contact4@example.com",
    name: "ABM Respiratory Care",
  },
  {
    phoneNumber: "(284) 525-7098",
    address: "973 Example Street, City 2, State NY",
    id: "JK-102",
    contactName: "Contact 2",
    email: "contact2@example.com",
    name: "P2 Oxygen",
  },
  {
    phoneNumber: "(672) 482-2618",
    address: "767 Example Street, City 9, State FL",
    contactName: "contact 9",
    id: "JK-109",
    email: "contact9@example.com",
    name: "LM Oxygen Solutions",
  },
  {
    phoneNumber: "(587) 463-3516",
    address: "421 Example Street, City 6, State FL",
    contactName: "Contact 6",
    id: "JK-106",
    email: "contact6@example.com",
    name: "Sentec",
  },
];

async function batchWrite(items) {
  let unprocessedItems = items;
  let batchCount = 0;

  // Process in batches of 25 (DynamoDB limit for batch write)
  while (unprocessedItems.length > 0) {
    const currentBatch = unprocessedItems.slice(0, 25);
    unprocessedItems = unprocessedItems.slice(25);

    const params = {
      RequestItems: {
        VendorAlt: currentBatch.map((item) => ({
          PutRequest: {
            Item: item,
          },
        })),
      },
    };

    try {
      const { UnprocessedItems } = await ddbDocClient.send(
        new BatchWriteCommand(params)
      );
      // Handle any unprocessed items appropriately
      if (UnprocessedItems && UnprocessedItems.VendorAlt) {
        unprocessedItems = [...UnprocessedItems.VendorAlt, ...unprocessedItems];
      }
      console.log(`Batch ${++batchCount}: Success`);
    } catch (err) {
      console.error("Error processing batch", batchCount, err);
      throw err; // or handle error appropriately
    }
  }
}

export const GET = async (req) => {
  try {
    await batchWrite(items);
    return NextResponse.json(
      { message: "Batch write successful" },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
