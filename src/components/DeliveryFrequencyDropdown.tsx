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
  const [isAnimating, setIsAnimating] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Find current selected plan
  const currentPlanIndex = sellingPlans.findIndex(
    (plan) => plan.shopifyId === cart.sellingPlanId
  );
  const currentPlan = sellingPlans[currentPlanIndex] || sellingPlans[0];

  // Format interval text
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
        closeDropdown();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle opening with animation
  const openDropdown = () => {
    setIsAnimating(true);
    setIsOpen(true);
    // Small delay to ensure the element is rendered before animation starts
    setTimeout(() => setIsAnimating(false), 10);
  };

  // Handle closing with animation
  const closeDropdown = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setIsOpen(false);
      setIsAnimating(false);
    }, 200); // Match transition duration
  };

  const toggleDropdown = () => {
    if (isOpen) {
      closeDropdown();
    } else {
      openDropdown();
    }
  };

  // Handle plan selection
  const handlePlanSelect = (plan: any) => {
    const newCart = { ...cart, sellingPlanId: plan.shopifyId };
    setCart(newCart);
    closeDropdown();
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
        onClick={toggleDropdown}
        className={classNames(className, 'delivery-dropdown-trigger')}
        type="button"
      >
        <span className="uppercase">Deliver Every &nbsp;</span>
        <b>{formatInterval(currentPlan)}</b>
        <i 
          className="material-icons delivery-dropdown-icon"
          style={{
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
          }}
        >
          expand_more
        </i>
      </button>

      {isOpen && (
        <div 
          ref={contentRef}
          className={classNames(
            'cadance-card dropdown-variant',
            isAnimating ? 'dropdown-closing' : 'dropdown-open'
          )}
        >
          <p className="uppercase">Deliver Every...</p>
          
          {sellingPlans.map((plan, index) => (
            <button
              key={plan.shopifyId || index}
              onClick={() => handlePlanSelect(plan)}
              type="button"
              className={classNames(
                'cadance-card-button base-border-1',
                plan.shopifyId === cart.sellingPlanId ? 'selected' : ''
              )}
            >
              <span>{formatInterval(plan)}</span>
              {plan.shopifyId === cart.sellingPlanId && (
                <i className="material-icons check-icon">check</i>
              )}
            </button>
          ))}
        </div>
      )}

      <style jsx>{`
        .delivery-dropdown-trigger {
          position: relative;
          display: inline-flex;
          align-items: center;
          cursor: pointer;
        }

        .delivery-dropdown-icon {
          margin-left: 4px;
          font-size: 20px;
          vertical-align: middle;
        }

        /* Dropdown container styles matching cadance-card */
        .cadance-card.dropdown-variant {
          position: absolute;
          top: calc(100% + 8px);
          left: 50%;
          transform: translateX(-50%);
          min-width: 200px;
          background: white;
          border-radius: 8px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1), 0 6px 10px rgba(0, 0, 0, 0.08);
          padding: 12px;
          z-index: 1000;
          transform-origin: top center;
        }

        /* Animation states */
        .dropdown-open {
          animation: dropdownOpen 0.2s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }

        .dropdown-closing {
          animation: dropdownClose 0.2s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }

        @keyframes dropdownOpen {
          0% {
            opacity: 0;
            transform: translateX(-50%) translateY(-10px) scaleY(0.8);
          }
          100% {
            opacity: 1;
            transform: translateX(-50%) translateY(0) scaleY(1);
          }
        }

        @keyframes dropdownClose {
          0% {
            opacity: 1;
            transform: translateX(-50%) translateY(0) scaleY(1);
          }
          100% {
            opacity: 0;
            transform: translateX(-50%) translateY(-10px) scaleY(0.8);
          }
        }

        /* Button styles matching original */
        .cadance-card.dropdown-variant .cadance-card-button {
          width: 100%;
          padding: 10px 12px;
          margin: 4px 0;
          text-align: left;
          background: transparent;
          border: 1px solid #e0e0e0;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 14px;
        }

        .cadance-card.dropdown-variant .cadance-card-button:hover {
          background: #f5f5f5;
          border-color: #d0d0d0;
        }

        .cadance-card.dropdown-variant .cadance-card-button.selected {
          background: #e3f2fd;
          border-color: #2196f3;
          color: #1976d2;
          font-weight: 500;
        }

        .cadance-card.dropdown-variant .cadance-card-button.selected:hover {
          background: #bbdefb;
        }

        /* Check icon */
        .check-icon {
          font-size: 18px;
          color: #1976d2;
          opacity: 0;
          transform: scale(0.8);
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .cadance-card-button.selected .check-icon {
          opacity: 1;
          transform: scale(1);
        }

        /* Title styling */
        .cadance-card.dropdown-variant > p {
          margin: 0 0 8px 4px;
          font-size: 11px;
          font-weight: 600;
          color: #666;
          letter-spacing: 0.5px;
        }

        /* Responsive adjustments */
        @media (max-width: 640px) {
          .cadance-card.dropdown-variant {
            left: 0;
            transform: translateX(0);
            right: auto;
            min-width: 250px;
          }

          @keyframes dropdownOpen {
            0% {
              opacity: 0;
              transform: translateY(-10px) scaleY(0.8);
            }
            100% {
              opacity: 1;
              transform: translateY(0) scaleY(1);
            }
          }

          @keyframes dropdownClose {
            0% {
              opacity: 1;
              transform: translateY(0) scaleY(1);
            }
            100% {
              opacity: 0;
              transform: translateY(-10px) scaleY(0.8);
            }
          }
        }

        /* Micro-interactions */
        .cadance-card-button {
          position: relative;
          overflow: hidden;
        }

        .cadance-card-button::after {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 0;
          height: 0;
          border-radius: 50%;
          background: rgba(33, 150, 243, 0.1);
          transform: translate(-50%, -50%);
          transition: width 0.3s, height 0.3s;
        }

        .cadance-card-button:active::after {
          width: 200px;
          height: 200px;
        }
      `}</style>
    </div>
  );
};

export default DeliveryFrequencyDropdown;