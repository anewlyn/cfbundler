"use client";

// temporary page to test the subscription button
import classNames from "classnames";
import ProductGrid from "@/components/ProductGrid";

const Bundler = () => {

  return (
    <div className={classNames('bundler-page')}>
      <h1>Bundler</h1>
      <ProductGrid />
    </div>
  );
}

export default Bundler;
