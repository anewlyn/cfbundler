'use client';

import classNames from 'classnames';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { kiro_bold_400 } from '@/app/ui/fonts';
import { useLoopContext } from '@/contexts/LoopProvider';
import BenefitTierProgressBar from './BenefitTierProgressBar';

type HeaderProps = {
  handleOpenCadenceModal: () => void;
};
const Header = ({ handleOpenCadenceModal }: HeaderProps) => {
  const { benefitTiers, cart, currentOrderValue, sellingPlans } = useLoopContext();

  const router = useRouter();

  useEffect(() => {
    const header = document.querySelector('header'); // Adjust the selector as needed
    const stickyThreshold = 100; // Change this to the scroll threshold you want

    const scrollHandler = () => {
      if (window.scrollY > stickyThreshold) {
        const headerHeight = header?.offsetHeight || 0;

        if (header) {
          header.classList.add('header-sticky');
          header.style.top = `-${headerHeight / 3}px`; // Move the header up to benefit tiers
        }
      } else {
        if (header) {
          header.classList.remove('header-sticky');
          header.style.top = ''; // Reset the top style when not sticky
        }
      }
    };

    window.addEventListener('scroll', scrollHandler);

    return () => {
      window.removeEventListener('scroll', scrollHandler);
    };
  }, []);

  const deliverySchedule = sellingPlans.find((cadence) => cadence.shopifyId === cart.sellingPlanId);

  const ScheduleButton = (className: string) => {
    const interval =
      Number(deliverySchedule?.deliveryIntervalCount) > 1
        ? `${deliverySchedule?.deliveryInterval}S`
        : deliverySchedule?.deliveryInterval;
    if (sellingPlans.length === 1) {
      return (
        <button className={className}>
          <span>DELIVER EVERY &nbsp;</span>
          <b>{`${deliverySchedule?.deliveryIntervalCount} ${interval}`}</b>
        </button>
      );
    } else {
      return (
        <button className={className} onClick={handleOpenCadenceModal}>
          <span>DELIVER EVERY &nbsp;</span>
          <b>{`${deliverySchedule?.deliveryIntervalCount} ${interval}`}</b>
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
          <Image
            alt="Logo"
            className="logo"
            height={93}
            src="/assets/cycling-frog-logo.png"
            width={170}
          />
        </div>
        <div className={classNames('header-title', kiro_bold_400.className)}>
          <h1>MY SUBSCRIPTION</h1>
          {ScheduleButton('header-button')}
        </div>
        <div className="header-progress-bar">
          <BenefitTierProgressBar currentValue={currentOrderValue} tiers={benefitTiers} />
        </div>
        {ScheduleButton('header-button header-button-mobile')}
      </header>
    </>
  );
};

export default Header;
