'use client';

import { useState, useRef, useEffect, useMemo, useId, KeyboardEvent } from 'react';
import classNames from 'classnames';
import { useLoopContext } from '@/contexts/LoopProvider';

interface DeliveryFrequencyDropdownProps {
  className?: string;
}

type SellingPlan = {
  shopifyId: number | string;
  deliveryInterval: string;       // e.g., "WEEK", "MONTH"
  deliveryIntervalCount: number;  // e.g., 1, 2, 3
};

const DeliveryFrequencyDropdown = ({ className = '' }: DeliveryFrequencyDropdownProps) => {
  const { sellingPlans, setCart, cart } = useLoopContext();
  const [isOpen, setIsOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  // Always call hooks before any early return
  const menuAutoId = useId();
  const menuId = `delivery-frequency-menu-${menuAutoId}`;

  // Resolve current plan (fallback to first if missing)
  const currentPlanIndex = useMemo(
    () =>
      Math.max(
        0,
        sellingPlans.findIndex(
          (p: SellingPlan) => String(p.shopifyId) === String(cart.sellingPlanId)
        )
      ),
    [sellingPlans, cart.sellingPlanId]
  );
  const currentPlan: SellingPlan = sellingPlans[currentPlanIndex] || sellingPlans[0];

  const formatInterval = (plan: SellingPlan) => {
    const plural =
      Number(plan.deliveryIntervalCount) > 1 ? `${plan.deliveryInterval}S` : plan.deliveryInterval;
    return `${plan.deliveryIntervalCount} ${plural}`;
  };

  // Click outside → close
  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!dropdownRef.current) return;
      if (!dropdownRef.current.contains(e.target as Node)) closeDropdown();
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);

  // When opening: animate + focus selected option
  useEffect(() => {
    if (!isOpen) return;
    const t = setTimeout(() => setIsAnimating(false), 10);
    const selected = menuRef.current?.querySelector<HTMLButtonElement>('[data-selected="true"]');
    selected?.focus();
    return () => clearTimeout(t);
  }, [isOpen]);

  // Keep selection synced if cart.sellingPlanId changes elsewhere
  useEffect(() => {
    if (isOpen) {
      const selected = menuRef.current?.querySelector<HTMLButtonElement>('[data-selected="true"]');
      selected?.focus();
    }
  }, [currentPlanIndex, isOpen]);

  const openDropdown = () => {
    setIsAnimating(true);
    setIsOpen(true);
  };

  const closeDropdown = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setIsOpen(false);
      setIsAnimating(false);
      triggerRef.current?.focus(); // return focus to trigger
    }, 200);
  };

  const toggleDropdown = () => (isOpen ? closeDropdown() : openDropdown());

  const handlePlanSelect = (plan: SellingPlan) => {
    setCart({ ...cart, sellingPlanId: plan.shopifyId });
    closeDropdown();
  };

  // Keyboard handling on the trigger
  const onTriggerKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openDropdown();
    }
  };

  // Keyboard handling on the menu
  const onMenuKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const items = Array.from(
      menuRef.current?.querySelectorAll<HTMLButtonElement>('[role="menuitemradio"]') || []
    );
    const idx = items.findIndex((el) => el === document.activeElement);
    const focusAt = (i: number) => items[Math.max(0, Math.min(items.length - 1, i))]?.focus();

    switch (e.key) {
      case 'Escape':
        e.preventDefault();
        closeDropdown();
        break;
      case 'ArrowDown':
        e.preventDefault();
        focusAt(idx < 0 ? 0 : idx + 1);
        break;
      case 'ArrowUp':
        e.preventDefault();
        focusAt(idx <= 0 ? items.length - 1 : idx - 1);
        break;
      case 'Home':
        e.preventDefault();
        focusAt(0);
        break;
      case 'End':
        e.preventDefault();
        focusAt(items.length - 1);
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        (document.activeElement as HTMLButtonElement)?.click();
        break;
    }
  };

  // Single-plan: render inert button (keeps layout stable)
  if (sellingPlans.length <= 1) {
    return (
      <button className={className} type="button" aria-disabled="true">
        <span className="uppercase">Deliver Every&nbsp;</span>
        <b>{currentPlan ? formatInterval(currentPlan) : ''}</b>
      </button>
    );
  }

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <button
        ref={triggerRef}
        onClick={toggleDropdown}
        onKeyDown={onTriggerKeyDown}
        className={classNames(className, 'delivery-dropdown-trigger')}
        type="button"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-controls={menuId}
      >
        <span className="uppercase">Deliver Every&nbsp;</span>
        <b>{formatInterval(currentPlan)}</b>
        <i
          className="material-icons delivery-dropdown-icon"
          style={{
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
          aria-hidden
        >
          expand_more
        </i>
      </button>

      {isOpen && (
        <div
          id={menuId}
          ref={menuRef}
          role="menu"
          aria-label="Delivery cadence options"
          tabIndex={-1}
          onKeyDown={onMenuKeyDown}
          className={classNames(
            'cadance-card dropdown-variant',
            isAnimating ? 'dropdown-closing' : 'dropdown-open'
          )}
        >
          <p className="uppercase">Deliver Every...</p>

          {sellingPlans.map((plan: SellingPlan, index: number) => {
            const selected = String(plan.shopifyId) === String(cart.sellingPlanId);
            return (
              <button
                key={String(plan.shopifyId) || index}
                type="button"
                role="menuitemradio"
                aria-checked={selected}
                data-selected={selected ? 'true' : undefined}
                onClick={() => handlePlanSelect(plan)}
                className={classNames('cadance-card-button base-border-1', selected && 'selected')}
              >
                <span>{formatInterval(plan)}</span>
                {selected && <i className="material-icons check-icon">check</i>}
              </button>
            );
          })}
        </div>
      )}

      <style jsx>{`
        .delivery-dropdown-trigger {
          position: relative;
          /* no display here: let .header-button / .header-button-mobile control visibility */
          align-items: center;
          cursor: pointer;
        }
        .delivery-dropdown-icon {
          margin-left: 4px;
          font-size: 20px;
          vertical-align: middle;
        }

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

        .cadance-card.dropdown-variant > p {
          margin: 0 0 8px 4px;
          font-size: 11px;
          font-weight: 600;
          color: #666;
          letter-spacing: 0.5px;
        }

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
