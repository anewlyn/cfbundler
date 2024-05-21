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

  const maxTierValue = Math.max(...tiers.map(tier => tier.value));
  const overlayWidth = (currentValue / maxTierValue) * 100;

  return (
    <div className="progress-bar">
      {tiers.map((tier, index) => (
        <div
          className="tier-marker"
          key={index}
          style={{ left: `${(tier.value / maxTierValue) * 100}%` }}
        >
          <div className="tier-line" />
          <div className="tier-label">{tier.label}</div>
          <div className="tier-subtitle">{tier.subtitle}</div>
        </div>
      ))}
      <div
        className="progress-bar-overlay"
        style={{ width: `${overlayWidth}%` }}
      />
    </div>
  );
};

export default BenefitTierProgressBar;
