'use client';

import { useState, useEffect, CSSProperties, useRef } from 'react';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import ProductCard from '@/components/ProductCard';
import ProductGrid from '@/components/ProductGrid';
import { useLoopContext } from '@/contexts/LoopProvider';
import { AllProductVariants } from '@/types/bundleTypes';
import { kiro_extra_bold_700 } from '@/app/ui/fonts';
import { Modal } from 'react-bootstrap';
import ModalContent from './ModalContent';
import { currencyFormatter } from '@/helpers/cartHelpers';

export const Bundle = (customProductData) => {
  const [modalProduct, setModalProduct] = useState<null | any>(null)
  const { products, benefitTiers, currentOrderValue } = useLoopContext()
  const [filter, setFilter] = useState('All')
  const [show, setShow] = useState(false)

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
            Bundle more, save more. Subscriptions require a $59 minimum order.
          </p>
        </div>
      </div>
      <div className={`cf-tiers-wrapper`}>
        <div className="cf-tiers-container">
          {benefitTiers.map((tier, index) => 
            <div 
              className="cf-tiers-tier"
              style={{
                '--cf-tier-progress':  Math.max(0, (currentOrderValue - (benefitTiers[index - 1]?.value ?? 0)) / (tier.value - (benefitTiers[index - 1]?.value ?? 0)) * 100) + '%',
              } as CSSProperties}
            >
              <div className="cf-tiers-tier-progress-text">
                {currentOrderValue >= tier.value
                  ? <><i className="material-icons check-icon">check</i> {tier.subtitle.split("Get")[1].split("!")[0]}</>
                  : <>{tier.subtitle.split("Get")[1].split("!")[0]} at {currencyFormatter(tier.value, 'USD', 0)}</>
                }
              </div>
              <div className="cf-tiers-tier-progress-fill"></div>
              <div className="cf-tiers-tier-default-text">
                {currentOrderValue >= tier.value
                  ? <><i className="material-icons check-icon">check</i> {tier.subtitle.split("Get")[1].split("!")[0]}</>
                  : <>{tier.subtitle.split("Get")[1].split("!")[0]} at {currencyFormatter(tier.value, 'USD', 0)}</>
                }
              </div>
            </div>
          )}
        </div>
      </div>
      <div className='cf-intro'>
        <div className="cf-intro-content">
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
