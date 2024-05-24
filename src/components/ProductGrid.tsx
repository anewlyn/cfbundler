import { useState } from "react";
import { useLoopContext } from "@/app/contexts/LoopProvider";
import InfoCard from "./InfoCard";
import { Modal } from "./Modal";
import ProductCard from "./ProductCard";

const ProductGrid = () => {
  // temporary data to test
  // @todo get the data from the Loop API
  const { mockProducts } = useLoopContext();
  const { products } = mockProducts;
  const [modalProduct, setModalProduct] = useState<any>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleOpenInfoModal = (product: any) => {
    console.log('product: ', product);
    // @todo open modal with product info
    setModalProduct(product);
    setModalOpen(true);
  }

  const handleCloseInfoModal = () => {
    setModalOpen(false);
  }

  return (
    <div className="bp-flex">
      {products.map((product, index) => {
        // This sets the images above the fold as priority
        const isPriority = index <= 7;

        return (
          <ProductCard key={`${product.shopifyId}${index}`} product={product} isPriority={isPriority} handleOpenInfoModal={handleOpenInfoModal} />
        )
      })}
      <Modal open={modalOpen} onClose={handleCloseInfoModal} ariaModalLabel="Product Info Modal">
        {/* @todo add product info modal */}
        <InfoCard data={modalProduct} />
      </Modal>
    </div>
  );
}

export default ProductGrid;
