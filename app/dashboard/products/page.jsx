import ProductTable from "@/components/ProductTable";

const Product = async () => {
  const response = await fetch(`${process.env.API_URL}/product`);
  if (!response.ok) {
    throw new Error(`HTTP Error! Status: ${response.status}`);
  }
  const data = await response.json();

  return <ProductTable data={data} />
};

export default Product;
