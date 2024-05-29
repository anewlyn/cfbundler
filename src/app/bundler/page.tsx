"use client";

import { useState } from "react";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import InfoCard from "@/components/InfoCard";
import { Modal } from "@/components/Modal";
import ProductCard from "@/components/ProductCard";
import ProductGrid from "@/components/ProductGrid";
import { useLoopContext } from "../contexts/LoopProvider";
// temporary page to test the subscription button


const Bundler = () => {
  // temporary data to test
  // @todo get the data from the Loop API
  const { mockProducts } = useLoopContext();
  const { products } = mockProducts;
  const [modalProduct, setModalProduct] = useState<any>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleOpenInfoModal = (product: any) => {
    // @todo open modal with product info
    setModalProduct(product);
    setModalOpen(true);
  }

  const handleCloseInfoModal = () => {
    setModalOpen(false);
  }

  const renderProductCards = () => {
    return products.map((product, index) => {
      // This sets the images above the fold as priority
      const isPriority = index <= 7;

      return (
        <ProductCard key={`${product.shopifyId}${index}`} product={product} isPriority={isPriority} handleOpenInfoModal={handleOpenInfoModal} />
      )
    })
  }

  return (
    <div className='bundler-page'>
      <Header />
      <ProductGrid>
        {renderProductCards()}
      </ProductGrid>
      <Modal open={modalOpen} onClose={handleCloseInfoModal} ariaModalLabel="Product Info Modal" hasMobileClose>
        {/* @todo add product info modal */}
        <InfoCard data={modalProduct} />
      </Modal>
      <Footer />
    </div >
  );
}

export default Bundler;
