'use client';

import classNames from 'classnames';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { kiro_bold_400 } from '@/app/ui/fonts';
import { useLoopContext } from '@/contexts/LoopProvider';
import BenefitTierProgressBar from './BenefitTierProgressBar';
import DeliveryFrequencyDropdown from './DeliveryFrequencyDropdown';


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
  // Simply return the dropdown component - it handles everything internally
  return <DeliveryFrequencyDropdown className={className} />;
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
