'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useLoopContext } from '@/contexts/LoopProvider';
import BenefitTierProgressBar from './BenefitTierProgressBar';
type HeaderProps = {
  handleOpenCadenceModal: () => void;
};
const Header = ({ handleOpenCadenceModal }: HeaderProps) => {
  const { cart, sellingPlans, benefitTiers, currentOrderValue } = useLoopContext();

  const router = useRouter();
  const deliverySchedule = sellingPlans.find((cadence) => cadence.shopifyId === cart.sellingPlanId);

  const ScheduleButton = (className: string) => {
    return (
      <button className={className} onClick={handleOpenCadenceModal}>
        <span>
          {/* @todo get schedule from data */}
          <span className="sans-serif">DELIVER EVERY &nbsp;</span>
          <b>{`${deliverySchedule?.deliveryIntervalCount} ${deliverySchedule?.deliveryInterval}`}</b>
          <i className="material-icons">expand_more</i>
        </span>
      </button>
    );
  };

  return (
    <>
      <header className="header">
        <div className="header-logo">
          {/* @todo route back to website */}
          <button className="back-anchor" onClick={() => router.back()}>
            <i className="material-icons back-arrow">west</i>BACK
          </button>
          {/* @todo get better logo */}
          <Image
            alt="Logo"
            className="logo"
            height={93}
            src="/assets/cycling-frog-logo.png"
            width={139}
          />
        </div>
        <div className="header-title">
          <h1>MY SUBSCRIPTION</h1>
          {ScheduleButton('header-button')}
        </div>

        <BenefitTierProgressBar currentValue={currentOrderValue} tiers={benefitTiers} />
      </header>
      {ScheduleButton('header-button header-button-mobile')}
    </>
  );
};

export default Header;
