'use client';

import { useState } from 'react';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import ProductCard from '@/components/ProductCard';
import ProductGrid from '@/components/ProductGrid';
import { useLoopContext } from '@/contexts/LoopProvider';
import { AllProductVariants } from '@/types/bundleTypes';
import { kiro_extra_bold_700 } from '@/app/ui/fonts';
import { Modal } from 'react-bootstrap';

export const Bundle = (customProductData) => {
  const [modalProduct, setModalProduct] = useState<null | AllProductVariants>(null)
  const { products } = useLoopContext()
  const [filter, setFilter] = useState('All')
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = (product: AllProductVariants) => {
    setModalProduct(product)
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
            Bundle more, save more.
          </p>
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
                  { type } 
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
      {modalProduct && <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{modalProduct.productTitle}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {modalProduct.body_html}
        </Modal.Body>
        <Modal.Footer>
          <button className='btn btn-black' onClick={handleClose}>
            Close
          </button>
        </Modal.Footer>
      </Modal>}
      <Footer customProducts={customProductData.customProductData} />
    </div>
  );
};
