import Image from "next/image";
import { useLoopContext } from "@/app/contexts/LoopProvider";
import BenefitTierProgressBar from "./BenefitTierProgressBar";
const Header = () => {
  const { mockOrder } = useLoopContext();
  const { deliverySchedule } = mockOrder;

  const handleDeliveryScheduleModal = () => {
    alert('Delivery Schedule Modal')
  }
  const currentOrderValue = 28; // @todo get from data
  const benefitTiers = [
    { label: '$50', subtitle: 'Min. Order', value: 50 },
    { label: '$100', subtitle: 'Free Shipping', value: 100 },
    { label: '$150', subtitle: '10% off', value: 150 },
  ];
  return (
    <header className="header">
      <div className="header-logo">
        <a
          className="back-anchor"
          href='/bundler'
        >
          <i
            className="material-icons back-arrow"
          >
            west
          </i>
          BACK
        </a>
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
        <button
          className="header-button"
          onClick={handleDeliveryScheduleModal}
        >
          {/* @todo get schedule from data */}
          DELIVER EVERY
          <b>{deliverySchedule}</b>
          <i className="material-icons">expand_more</i>
        </button>
      </div>

      <BenefitTierProgressBar
        currentValue={currentOrderValue}
        tiers={benefitTiers} />

    </header>
  );
}

export default Header;
