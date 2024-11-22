import ProductTable from "@/components/ProductTable";

const Product = async () => {
  const response = await fetch(`${process.env.CLIENT_SERVER_API}/product`);
  if (!response.ok) {
    throw new Error(`HTTP Error! Status: ${response.status}`);
  }
  const data = await response.json();

  return <ProductTable data={data} />
};

export default Product;
