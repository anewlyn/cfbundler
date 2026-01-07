'use client';

import { useState, useEffect } from 'react';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import ProductCard from '@/components/ProductCard';
import ProductGrid from '@/components/ProductGrid';
import { useLoopContext } from '@/contexts/LoopProvider';
import { AllProductVariants } from '@/types/bundleTypes';
import { kiro_extra_bold_700 } from '@/app/ui/fonts';
import { Modal } from 'react-bootstrap';
import ModalContent from './ModalContent';
import BenefitTierProgressBar from './BenefitTierProgressBar';
import { currencyFormatter } from '@/helpers/cartHelpers';

export const Bundle = (customProductData) => {
  const [modalProduct, setModalProduct] = useState<null | any>(null)
  const { products, bundle, benefitTiers, currentOrderValue } = useLoopContext()
  const [filter, setFilter] = useState('All')
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = (product: AllProductVariants) => {
    setModalProduct(product)
    console.log('product', product)
    setShow(true)
  }

  function handleFilter(type) {
    setFilter(type)
  }

  const allProductTypes: Set<any> = new Set(customProductData.customProductData.map(product => product.productType))
  const productTypes: Array<string> = Array.from(allProductTypes)

  useEffect(() => {
    console.log('\n\n\n benefitTiers', benefitTiers)
  }, [])

  return (
    <div className="bundler-page">
      <Header />
      <div className='cf-intro'>
        <div className="cf-intro-content">
          <h1 className={kiro_extra_bold_700.className}>
            Build Your <br />
            Subscription
          </h1>
          <p>
            Bundle more, save more.
          </p>
          <div className="cf-tiers-wrapper">
            <div className="cf-tiers-container">
              <div className="cf-tiers-tier">
                <div className="cf-tiers-tier-progress-text">
                  10% off at $59
                </div>
                <div className="cf-tiers-tier-progress-fill"></div>
                <div className="cf-tiers-tier-default-text">
                  10% off at $59
                </div>
              </div>
              {/**********/}
            </div>
          </div>
          {benefitTiers.map(tier => <p>{tier.subtitle}, {currencyFormatter(tier.value, 'USD', 0)} - {currentOrderValue}</p>)}
          <ul className='product-filters'>
            <li>
              <button
                className={`btn ${filter === 'All' ? 'btn-white active' : 'btn-fizz'}`}
                onClick={() => handleFilter('All')}
              >
                All
              </button>
            </li>
            {productTypes.map(type => (
              <li>
                <button
                  className={`btn ${filter === type ? 'btn-white active' : 'btn-fizz'}`}
                  onClick={() => handleFilter(type)}
                >
                  { type.match(/\b\w+s\b/g)?.length ? type : type + 's' } 
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <ProductGrid>
        {products.map((product: AllProductVariants, index: number) => {
          // This sets the images above the fold as priority
          const isPriority = index <= 7;

          return (
            <ProductCard
              key={`${product.shopifyId}${index}`}
              filter={filter}
              customProduct={customProductData.customProductData.find(x => x.productId === product.looxReviewId)}
              product={product}
              isPriority={isPriority}
              handleOpenInfoModal={() => handleShow(product)}
            />
          );
        })}
      </ProductGrid>
      {modalProduct && 
        <Modal 
          show={show} 
          onHide={handleClose}
          scrollable={true}
          centered={true}
          fullscreen='md-down'
          size='xl'
          className='p-0'
        >
          <ModalContent 
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
            handleClose={handleClose}
          />
        </Modal>
      }
      <Footer customProducts={customProductData.customProductData} />
    </div>
  );
};
