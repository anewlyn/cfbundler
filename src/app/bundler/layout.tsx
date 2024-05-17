"use client";

import LoopProvider from "../contexts/LoopProvider";

const BundlerLayout = ({
  children,
}: {
  children: React.ReactNode
}) => {

  return (
    <LoopProvider>
      <section>{children}</section>
    </LoopProvider>
  )
}

export default BundlerLayout;
