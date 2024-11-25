import ProductTable from "@/components/ProductTable";
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';
const Product = async () => {
  const response = await fetch(`${process.env.API_URL}/product`);
  if (response.status === 404) {
    notFound();
  }
  if (!response.ok) {
    throw new Error(`HTTP Error! Status: ${response.status}`);
  }
  const data = await response.json();

  return <ProductTable data={data} />;
};

export default Product;
