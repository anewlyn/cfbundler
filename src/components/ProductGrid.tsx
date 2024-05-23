import { useLoopContext } from "@/app/contexts/LoopProvider";
import ProductCard from "./ProductCard";

const ProductGrid = () => {
  // temporary data to test
  // @todo get the data from the Loop API
  const { mockProducts } = useLoopContext();
  const { products } = mockProducts;

  return (
    <div className="bp-flex">
      {products.map((product, index) => {
        // This sets the images above the fold as priority
        const isPriority = index <= 7;

        return <ProductCard key={`${product.shopifyId}${index}`} product={product} isPriority={isPriority} />
      })}
    </div>
  );
}

export default ProductGrid;
