'use client';

import classNames from 'classnames';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { kiro_bold_400 } from '@/app/ui/fonts';
import { useLoopContext } from '@/contexts/LoopProvider';
import BenefitTierProgressBar from './BenefitTierProgressBar';

type HeaderProps = {
  handleOpenCadenceModal: () => void;
};
const Header = ({ handleOpenCadenceModal }: HeaderProps) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [headerTitleHeight, setHeaderTitleHeight] = useState(0);
  const { benefitTiers, cart, currentOrderValue, sellingPlans } = useLoopContext();
  const headerTitleRef = useRef<HTMLDivElement>(null);

  const router = useRouter();

  useEffect(() => {
    const stickyThreshold = 100; // Change this to the scroll threshold you want

    const scrollHandler = () => {
      setIsScrolled(window.scrollY > stickyThreshold);
      setHeaderTitleHeight(headerTitleRef.current?.offsetHeight || 0);
    };

    window.addEventListener('scroll', scrollHandler);

    scrollHandler();

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
          <span className="uppercase">Deliver Every &nbsp;</span>
          <b>{`${deliverySchedule?.deliveryIntervalCount} ${interval}`}</b>
        </button>
      );
    } else {
      return (
        <button className={className} onClick={handleOpenCadenceModal}>
          <span className="uppercase">Deliver Every &nbsp;</span>
          <b>{`${deliverySchedule?.deliveryIntervalCount} ${interval}`}</b>
          <i className="material-icons">expand_more</i>
        </button>
      );
    }
  };

  return (
    <>
      <header
        className="header"
        style={
          {
            '--header-mobile-top': isScrolled ? `-${headerTitleHeight}px` : '0',
          } as React.CSSProperties
        }
      >
        <div className="header-logo">
          {/* @todo route back to website */}
          <button className="back-anchor uppercase" onClick={() => router.back()}>
            <i className="material-icons back-arrow">west</i>back
          </button>
          <a href="https://cyclingfrog.com">
          <Image
            alt="Logo"
            className="logo"
            height={93}
            src="https://bundler.cyclingfrog.com/assets/cycling-frog-logo.png"
            width={170}
          />
          </a>
        </div>
        <div ref={headerTitleRef} className={classNames('header-title', kiro_bold_400.className)}>
          <h1 className="uppercase">My Subscription</h1>
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
