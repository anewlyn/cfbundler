import { ReactNode } from "react";

const ProductGrid = ({
  children
}: {
  children: ReactNode
}) => {

  return (
    <div className="bp-flex">
      {children}
    </div>
  );
}

export default ProductGrid;
