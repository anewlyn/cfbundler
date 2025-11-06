'use client';

import { useState, useRef, useEffect } from 'react';
import classNames from 'classnames';
import { useLoopContext } from '@/contexts/LoopProvider';

interface DeliveryFrequencyDropdownProps {
  className?: string;
}

const DeliveryFrequencyDropdown = ({ className = '' }: DeliveryFrequencyDropdownProps) => {
  const { sellingPlans, setCart, cart } = useLoopContext();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Find current selected plan
  const currentPlanIndex = sellingPlans.findIndex(
    (plan) => plan.shopifyId === cart.sellingPlanId
  );
  const currentPlan = sellingPlans[currentPlanIndex] || sellingPlans[0];

  // Format interval text (same logic as modal)
  const formatInterval = (plan: any) => {
    const interval = Number(plan?.deliveryIntervalCount) > 1
      ? `${plan?.deliveryInterval}S`
      : plan?.deliveryInterval;
    return `${plan.deliveryIntervalCount} ${interval}`;
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle plan selection - immediately updates cart (no save button needed)
  const handlePlanSelect = (plan: any) => {
    const newCart = { ...cart, sellingPlanId: plan.shopifyId };
    setCart(newCart);
    setIsOpen(false);
  };

  // Don't render dropdown if only one plan
  if (sellingPlans.length === 1) {
    return (
      <button className={className}>
        <span className="uppercase">Deliver Every &nbsp;</span>
        <b>{formatInterval(currentPlan)}</b>
      </button>
    );
  }

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={className}
        type="button"
      >
        <span className="uppercase">Deliver Every &nbsp;</span>
        <b>{formatInterval(currentPlan)}</b>
        <i className={`material-icons transition-transform ${isOpen ? 'rotate-180' : ''}`}>
          expand_more
        </i>
      </button>

      {isOpen && (
        <div className="absolute z-50 min-w-[200px] mt-2 bg-white border border-gray-300 rounded-lg shadow-lg overflow-hidden">
          <p className="uppercase text-xs px-4 pt-3 pb-1 text-gray-600">Deliver Every...</p>
          
          {sellingPlans.map((plan, index) => (
            <button
              key={plan.shopifyId || index}
              onClick={() => handlePlanSelect(plan)}
              type="button"
              className={classNames(
                'w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors flex items-center justify-between',
                plan.shopifyId === cart.sellingPlanId ? 'bg-blue-50 text-blue-600' : ''
              )}
            >
              <span>{formatInterval(plan)}</span>
              {plan.shopifyId === cart.sellingPlanId && (
                <i className="material-icons text-blue-600 text-base">check</i>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default DeliveryFrequencyDropdown;