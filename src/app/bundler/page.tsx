"use client";

import { useState } from "react";
import SubscriptionButton from "@/components/AddToButton";
// temporary page to test the subscription button
const Bundler = () => {
  const [qty, setQty] = useState(1);
  return (
    <div style={{ height: "100%" }}>
      <h1>Bundler</h1>
      <SubscriptionButton qty={qty} setQty={setQty} />
    </div>
  );
}

export default Bundler;
