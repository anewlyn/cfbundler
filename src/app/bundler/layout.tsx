import LoopProvider from '@/contexts/LoopProvider';
import { getBundle } from '../queries/get-bundle';

const BundlerLayout = async ({ children }: { children: React.ReactNode }) => {
  const bundleData = await getBundle();

  return (
    <LoopProvider
      bundleData={bundleData.data}
    >
      <section>{children}</section>
    </LoopProvider>
  );
};

export default BundlerLayout;
