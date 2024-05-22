import Image from "next/image";
import { useLoopContext } from "@/app/contexts/LoopProvider";
import BenefitTierProgressBar from "./BenefitTierProgressBar";
const Header = () => {
  const { mockOrder } = useLoopContext();
  const { deliverySchedule } = mockOrder;

  const handleDeliveryScheduleModal = () => {
    alert('Delivery Schedule Modal')
  }

  // @todo get from data
  const currentOrderValue = 42;
  const benefitTiers = [
    { label: '$50', subtitle: 'Min. Order', value: 50 },
    { label: '$100', subtitle: 'Free Shipping', value: 100 },
    { label: '$150', subtitle: '10% off', value: 150 },
  ];

  const ScheduleButton = (className: string) => {
    return (
      <button
        className={className}
        onClick={handleDeliveryScheduleModal}
      >
        <span>
          {/* @todo get schedule from data */}
          <span className="sans-serif">DELIVER EVERY &nbsp;</span>
          <b>{deliverySchedule}</b>
          <i className="material-icons">expand_more</i>
        </span>
      </button >
    );
  }


  return (
    <>
      <header className="header">
        <div className="header-logo">
          {/* @todo route back to website */}
          <a
            className="back-anchor"
            href='/bundler'
          >
            <i className="material-icons back-arrow">west</i>BACK
          </a>
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
          {ScheduleButton("header-button")}
        </div>

        <BenefitTierProgressBar
          currentValue={currentOrderValue}
          tiers={benefitTiers} />
      </header>
      {ScheduleButton("header-button header-button-mobile")}
    </>
  );
}

export default Header;
