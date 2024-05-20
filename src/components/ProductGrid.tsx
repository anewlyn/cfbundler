import { useLoopContext } from "@/app/contexts/LoopProvider";
import ProductCard from "./ProductCard";


const ProductGrid = () => {
  // temporary data to test
  // @todo get the data from the Loop API
  const { mockData } = useLoopContext();
  const { products } = mockData;

  return (
    <div className="bp-flex">
      {products.map((product) => (
        <ProductCard key={product.shopifyId} product={product} />
      ))}
    </div>
  );
}

export default ProductGrid;
