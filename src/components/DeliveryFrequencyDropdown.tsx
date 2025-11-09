'use client';

import { useState, useRef, useEffect, useMemo, useId, KeyboardEvent } from 'react';
import classNames from 'classnames';
import { useLoopContext, LoopContextType } from '@/contexts/LoopProvider';

interface DeliveryFrequencyDropdownProps {
  className?: string;
}

type PlanType = LoopContextType['sellingPlans'][number];

const DeliveryFrequencyDropdown = ({ className = '' }: DeliveryFrequencyDropdownProps) => {
  const { sellingPlans, setCart, cart } = useLoopContext();
  const [isOpen, setIsOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const toNum = (v: unknown) => {
    if (typeof v === 'number') return v;
    if (typeof v === 'string') {
      const digits = v.replace(/[^\d]/g, '');
      const n = Number(digits.length ? digits : v);
      return Number.isNaN(n) ? -1 : n;
    }
    return -1;
  };

  const currentPlanIndex = useMemo(
    () => Math.max(0, sellingPlans.findIndex((p: PlanType) => toNum(p.shopifyId) === cart.sellingPlanId)),
    [sellingPlans, cart.sellingPlanId]
  );
  const currentPlan: PlanType = sellingPlans[currentPlanIndex] || sellingPlans[0];

  const formatInterval = (plan: PlanType) => {
    const plural = Number(plan.deliveryIntervalCount) > 1
      ? `${plan.deliveryInterval}S`
      : plan.deliveryInterval;
    return `${plan.deliveryIntervalCount} ${plural}`;
  };

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!dropdownRef.current) return;
      if (!dropdownRef.current.contains(e.target as Node)) closeDropdown();
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const t = setTimeout(() => setIsAnimating(false), 10);
    menuRef.current?.querySelector<HTMLButtonElement>('[data-selected="true"]')?.focus();
    return () => clearTimeout(t);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    menuRef.current?.querySelector<HTMLButtonElement>('[data-selected="true"]')?.focus();
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
  //    triggerRef.current?.focus();
    }, 200);
  };
  const toggleDropdown = () => (isOpen ? closeDropdown() : openDropdown());

  const handlePlanSelect = (plan: PlanType) => {
    const id = toNum(plan.shopifyId); 
    if (id < 0) return console.warn('[DeliveryFrequencyDropdown] Invalid sellingPlanId:', plan.shopifyId);
    setCart({ ...cart, sellingPlanId: id }); 
    closeDropdown();
  };


    const onTriggerKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
        return //debug
      if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openDropdown();
      }
    };
  
    const onMenuKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
        return //debug
      const items = Array.from(menuRef.current?.querySelectorAll<HTMLButtonElement>('[role="menuitemradio"]') || []);
      const idx = items.findIndex((el) => el === document.activeElement);
      const focusAt = (i: number) => items[Math.max(0, Math.min(items.length - 1, i))]?.focus();
  
      switch (e.key) {
        case 'Escape': e.preventDefault(); closeDropdown(); break;
        case 'ArrowDown': e.preventDefault(); focusAt(idx < 0 ? 0 : idx + 1); break;
        case 'ArrowUp': e.preventDefault(); focusAt(idx <= 0 ? items.length - 1 : idx - 1); break;
        case 'Home': e.preventDefault(); focusAt(0); break;
        case 'End': e.preventDefault(); focusAt(items.length - 1); break;
        case 'Enter':
        case ' ': e.preventDefault(); (document.activeElement as HTMLButtonElement)?.click(); break;
      }
    };
  

  if (sellingPlans.length <= 1) {
    return (
      <button className={className} type="button" aria-disabled="true">
        <span className="uppercase">Deliver Every&nbsp;</span>
        <b>{currentPlan ? formatInterval(currentPlan) : ''}</b>
      </button>
    );
  }

  const menuAutoId = useId();
  const menuId = `delivery-frequency-menu-${menuAutoId}`;

  return (
    <div className="delivery-dd" ref={dropdownRef}>
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
    <i className="material-icons delivery-dropdown-icon" aria-hidden>expand_more</i>
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
        'delivery-dd-menu',             
        isAnimating ? 'dropdown-closing' : 'dropdown-open'
      )}
    >
          <p className="uppercase">Deliver Every...</p>

          {sellingPlans.map((plan: PlanType, index: number) => {
            const selected = toNum(plan.shopifyId) === cart.sellingPlanId;
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
    </div>
  );
};

export default DeliveryFrequencyDropdown;
