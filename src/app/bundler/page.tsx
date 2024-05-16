"use client";

import { useState } from "react";
import AddToButton from "@/components/AddToButton";
// temporary page to test the subscription button
import mockData from "../data/mockData.js";

const Bundler = () => {
  const [qty, setQty] = useState(1);

  // temporary data to test
  // @todo get the data from the Loop API
  const { products } = mockData;
  const maxQty = products[0].limits[0].maxValue;

  // @todo get stock qty from the shopify API
  const stockQty = 0;

  return (
    <div style={{ height: "100%" }}>
      <h1>Bundler</h1>
      <AddToButton orderQty={qty} maxQty={maxQty} setQty={setQty} stockQty={stockQty} />
    </div>
  );
}

export default Bundler;
