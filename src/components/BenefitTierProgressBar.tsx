import classNames from 'classnames';

interface BenefitTier {
  value: number;
  subtitle: string;
}

interface BenefitTierProgressBarProps {
  currentValue: number;
  tiers: BenefitTier[];
}

const BenefitTierProgressBar = ({ currentValue, tiers }: BenefitTierProgressBarProps) => {
  return (
    // grid
    <div className="progress-bar">
      {/* grid columns */}
      <div className={classNames(`grid-cols-${tiers.length}`)}>
        {tiers.map((tier, index) => {
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
              {/* grid rows */}
              <div className="tier-line row-1" />
              <div>
                {Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD',
                  maximumFractionDigits: 0,
                }).format(tier.value)}
              </div>
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
        })}
      </div>
    </div>
  );
};

export default BenefitTierProgressBar;
