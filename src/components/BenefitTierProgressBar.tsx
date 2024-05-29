import classNames from 'classnames';

interface BenefitTier {
  value: number;
  label: string;
  subtitle: string;
}

interface BenefitTierProgressBarProps {
  currentValue: number;
  tiers: BenefitTier[];
}

const BenefitTierProgressBar = ({ currentValue, tiers }: BenefitTierProgressBarProps) => {
  const maxTierValue = Math.max(...tiers.map((tier) => tier.value));
  const overlayWidth = Math.min((currentValue / maxTierValue) * 100, 100);
  return (
    // grid
    <div className="progress-bar">
      {/* grid columns */}
      <div className={classNames(`grid-cols-${tiers.length}`)}>
        {tiers.map((tier, index) => {
          const isValueMet = tier.value <= currentValue;

          return (
            <div className={classNames('tier-marker')} key={index}>
              {/* grid rows */}
              <div className="tier-line row-1" />
              <div>{tier.label}</div>
              <div className="tier-subtitle">
                <i className={classNames('material-icons', !isValueMet && 'no-display')}>check</i>
                {tier.subtitle}
              </div>
            </div>
          );
        })}
      </div>
      <div className="progress-bar-overlay" style={{ width: `${overlayWidth}%` }} />
    </div>
  );
};

export default BenefitTierProgressBar;
