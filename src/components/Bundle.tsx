'use client';

import { useState } from 'react';
import DeliverCadenceCard from '@/components/DeliverCadenceCard';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import InfoCard from '@/components/InfoCard';
import { Modal } from '@/components/Modal';
import ProductCard from '@/components/ProductCard';
import ProductGrid from '@/components/ProductGrid';
import { useLoopContext } from '@/contexts/LoopProvider';
import { AllProductVariants } from '@/types/bundleTypes';
import { kiro_bold_400 } from '@/app/ui/fonts';

export const Bundle = (customProductData) => {
  const [infoModalOpen, setInfoModalOpen] = useState(false);
  const [cadenceModalOpen, setCadenceModalOpen] = useState(false);
  const [modalProduct, setModalProduct] = useState<null | AllProductVariants>(null);
  const { products } = useLoopContext();

  const handleOpenInfoModal = (product: AllProductVariants) => {
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

  return (
    <div className="bundler-page">
      <Header handleOpenCadenceModal={handleOpenCadenceModal} />
      <Modal
        open={cadenceModalOpen}
        onClose={handleCloseCadenceModal}
        ariaModalLabel="Delivery Cadence Modal"
        hasCloseButton
      >
        <DeliverCadenceCard onClose={handleCloseCadenceModal} />
      </Modal>
      <div className='cf-intro'>
        <div className="cf-intro-content">
          <h1 className={kiro_bold_400.className}>Build Your Subscription Bundle</h1>
          <p>
            Lorem ipsum.
          </p>
        </div>
      </div>
      <ProductGrid>
        {products.map((product: AllProductVariants, index: number) => {
          // This sets the images above the fold as priority
          const isPriority = index <= 7;

          return (
            <ProductCard
              key={`${product.shopifyId}${index}`}
              customProduct={customProductData.customProductData.find(x => x.productId === product.looxReviewId)}
              product={product}
              isPriority={isPriority}
              handleOpenInfoModal={handleOpenInfoModal}
            />
          );
        })}
      </ProductGrid>
      <Modal
        open={infoModalOpen}
        onClose={handleCloseInfoModal}
        ariaModalLabel="Product Info Modal"
        hasCloseButton
      >
        {modalProduct && (
          <InfoCard
            customProduct={customProductData.customProductData.find(x => x.productId === modalProduct.looxReviewId)}
            body_html={modalProduct.body_html}
            images={modalProduct.images}
            isVariant={modalProduct.isVariant}
            limits={modalProduct.limits}
            outOfStock={modalProduct.outOfStock}
            price={modalProduct.price}
            productTitle={modalProduct.productTitle}
            shopifyId={modalProduct.shopifyId}
            looxReviewId={modalProduct.looxReviewId}
            title={modalProduct.title}
            variants={modalProduct.variants}
          />
        )}
      </Modal>
      <Footer customProducts={customProductData.customProductData} />
    </div>
  );
};
