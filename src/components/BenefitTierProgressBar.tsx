import classNames from 'classnames';
import { useLoopContext } from '@/contexts/LoopProvider';
import { currencyFormater } from '@/helpers/cartHelpers';

interface BenefitTier {
  value: number;
  subtitle: string;
}

interface BenefitTierProgressBarProps {
  currentValue: number;
  tiers: BenefitTier[];
}

const BenefitTierProgressBar = ({ currentValue, tiers }: BenefitTierProgressBarProps) => {
  const { bundle } = useLoopContext();

  const renderTiers = () => {
    return tiers.map((tier, index) => {
      const isValueMet = tier.value <= currentValue;
      const previousTierValue = tiers[index - 1]?.value || 0;
      const tierRange = tier.value - previousTierValue;
      const tierOverlayWidth = Math.min(
        ((currentValue - previousTierValue) / tierRange) * 100,
        100,
      );
      const showOverlay = tierOverlayWidth > 0;

      return (
        <div className={classNames('tier-marker')} key={index}>
          <div className="tier-line row-1" />
          <div>{currencyFormater(tier.value, bundle.currencyCode)}</div>
          <div className="tier-subtitle">
            <i className={classNames('material-icons', !isValueMet && 'no-display')}>check</i>
            {tier.subtitle}
          </div>
          <div
            className="progress-bar-overlay"
            style={{ width: `${showOverlay ? tierOverlayWidth : 0}%` }}
          />
        </div>
      );
    });
  };

  return (
    <div className="progress-bar">
      <div className={classNames(`grid-cols-${tiers.length}`)}>{renderTiers()}</div>
    </div>
  );
};

export default BenefitTierProgressBar;
