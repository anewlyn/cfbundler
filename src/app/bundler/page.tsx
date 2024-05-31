'use client';

import { useState } from 'react';
import DeliverCadenceCard from '@/components/DeliverCadenceCard';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import InfoCard from '@/components/InfoCard';
import { Modal } from '@/components/Modal';
import ProductCard from '@/components/ProductCard';
import ProductGrid from '@/components/ProductGrid';
import useBundle from '../hooks/use-bundle';
// temporary page to test the subscription button

const Bundler = () => {
  // temporary data to test
  // @todo get the data from the Loop API

  const [infoModalOpen, setInfoModalOpen] = useState(false);
  const [cadenceModalOpen, setCadenceModalOpen] = useState(false);
  /* eslint-disable-next-line  @typescript-eslint/no-explicit-any */
  const [modalProduct, setModalProduct] = useState<any>(null);
  const { data, isLoading } = useBundle();

  if (isLoading) {
    return null;
  }

  const { products } = data.data;

  /* eslint-disable-next-line  @typescript-eslint/no-explicit-any */
  const handleOpenInfoModal = (product: any) => {
    // @todo open modal with product info
    setModalProduct(product);
    setInfoModalOpen(true);
  };

  const handleCloseInfoModal = () => {
    setInfoModalOpen(false);
  };

  const handleCloseCadenceModal = () => {
    setCadenceModalOpen(false);
  };

  const handleOpenCadenceModal = () => {
    setCadenceModalOpen(true);
  };

  const renderProductCards = () => {
    /* eslint-disable-next-line  @typescript-eslint/no-explicit-any */
    return products.map((product: any, index: any) => {
      // This sets the images above the fold as priority
      const isPriority = index <= 7;

      return (
        <ProductCard
          key={`${product.shopifyId}${index}`}
          product={product}
          isPriority={isPriority}
          handleOpenInfoModal={handleOpenInfoModal}
        />
      );
    });
  };

  return (
    <div className="bundler-page">
      <Header handleOpenCadenceModal={handleOpenCadenceModal} />
      <Modal
        open={cadenceModalOpen}
        onClose={handleCloseCadenceModal}
        ariaModalLabel="Delivery Cadence Modal"
      >
        <DeliverCadenceCard onClose={handleCloseCadenceModal} />
      </Modal>
      <ProductGrid>{renderProductCards()}</ProductGrid>
      <Modal
        open={infoModalOpen}
        onClose={handleCloseInfoModal}
        ariaModalLabel="Product Info Modal"
        hasMobileClose
        hasCloseButton
      >
        <InfoCard data={modalProduct} />
      </Modal>
      <Footer />
    </div>
  );
};

export default Bundler;
