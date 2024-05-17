"use client";

// temporary page to test the subscription button
import classNames from "classnames";
import ProductCard from "@/components/ProductCard";
import { useLoopContext, LoopContextType } from "../contexts/LoopProvider";

const Bundler = () => {

  // temporary data to test
  // @todo get the data from the Loop API
  const { mockData } = useLoopContext() as LoopContextType;
  const { products } = mockData;

  return (
    <div className={classNames('bundler-page')} style={{ height: "100%" }}>
      <h1>Bundler</h1>
      <div className="bp-grid">
        {products.map((product) => (
          <ProductCard key={product.shopifyId} product={product} />
        ))}
      </div>
    </div>
  );
}

export default Bundler;
