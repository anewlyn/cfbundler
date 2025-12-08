'use client';

import classNames from 'classnames';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { kiro_bold_400 } from '@/app/ui/fonts';
import { useLoopContext } from '@/contexts/LoopProvider';
import BenefitTierProgressBar from './BenefitTierProgressBar';
import DeliveryFrequencyDropdown from './DeliveryFrequencyDropdown';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [headerTitleHeight, setHeaderTitleHeight] = useState(0);
  const { benefitTiers, currentOrderValue } = useLoopContext();
  const headerTitleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stickyThreshold = 100;
    const onScroll = () => {
      setIsScrolled(window.scrollY > stickyThreshold);
      setHeaderTitleHeight(headerTitleRef.current?.offsetHeight || 0);
    };
    window.addEventListener('scroll', onScroll);
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const ScheduleButton = (className: string) => (
    <DeliveryFrequencyDropdown className={className} />
  );

  return (
    <header
      className="header"
      style={
        { '--header-mobile-top': isScrolled ? `-${headerTitleHeight}px` : '0' } as React.CSSProperties
      }
    >
      <div className="header-logo">
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

      <div className="cf-bundle-progress">
        <div className="cf-bundle-progress-discount cf-text-heading cf-uppercase">
          <span className="cf-bundle-progress-discount-percentage">10%</span>
          <span>Off</span>
        </div>
        <svg className="cf-bundle-progress-bar" width="64px" height="64px" viewBox="0 0 72 72" style={{ transform: 'rotate(-90deg)'}}>
          <circle r="32" cx="36" cy="36" fill="transparent" stroke="#ffb3ab" stroke-width="8"></circle>
          <circle r="32" cx="36" cy="36" fill="transparent" stroke="#000000" stroke-width="8" stroke-linecap="round" stroke-dashoffset="132px" stroke-dasharray="200.96px"></circle>
        </svg>
      </div>
      
    </header>
  );
};

export default Header;
