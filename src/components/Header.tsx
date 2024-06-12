'use client';

import classNames from 'classnames';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { kiro_700 } from '@/app/ui/fonts';
import { useLoopContext } from '@/contexts/LoopProvider';
import BenefitTierProgressBar from './BenefitTierProgressBar';

type HeaderProps = {
  handleOpenCadenceModal: () => void;
};
const Header = ({ handleOpenCadenceModal }: HeaderProps) => {
  const { benefitTiers, cart, currentOrderValue, sellingPlans } = useLoopContext();

  const router = useRouter();
  const deliverySchedule = sellingPlans.find((cadence) => cadence.shopifyId === cart.sellingPlanId);

  const ScheduleButton = (className: string) => {
    if (sellingPlans.length === 1) {
      return (
        <button className={className}>
          <span>DELIVER EVERY &nbsp;</span>
          <b>{`${deliverySchedule?.deliveryIntervalCount} ${deliverySchedule?.deliveryInterval}`}</b>
        </button>
      );
    } else {
      return (
        <button className={className} onClick={handleOpenCadenceModal}>
          <span>DELIVER EVERY &nbsp;</span>
          <b>{`${deliverySchedule?.deliveryIntervalCount} ${deliverySchedule?.deliveryInterval}`}</b>
          <i className="material-icons">expand_more</i>
        </button>
      );
    }
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
            width={170}
          />
        </div>
        <div className={classNames('header-title', kiro_700.className)}>
          <h1>MY SUBSCRIPTION</h1>
          {ScheduleButton('header-button')}
        </div>
        <div className="header-progress-bar">
          <BenefitTierProgressBar currentValue={currentOrderValue} tiers={benefitTiers} />
        </div>
      </header>
      {ScheduleButton('header-button header-button-mobile')}
    </>
  );
};

export default Header;
