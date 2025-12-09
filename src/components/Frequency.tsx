'use client';

import { useState, useRef, useEffect, useMemo, useId, KeyboardEvent } from 'react';
import { useLoopContext, LoopContextType } from '@/contexts/LoopProvider';
import { Dropdown } from 'react-bootstrap'

type PlanType = LoopContextType['sellingPlans'][number];

const Frequency = () => {
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

    const openDropdown = () => {
        setIsAnimating(true);
        setIsOpen(true);
    };
    const closeDropdown = () => {
        setIsAnimating(true);
        setTimeout(() => {
            setIsOpen(false);
            setIsAnimating(false);
            triggerRef.current?.focus();
        }, 200);
    };
    const toggleDropdown = () => (isOpen ? closeDropdown() : openDropdown());

    useEffect(() => {
        if (!isOpen) return;
        const animTimer = window.setTimeout(() => setIsAnimating(false), 10);
        const focusSelected = () => {
            const el = menuRef.current?.querySelector<HTMLButtonElement>('[data-selected="true"]');
            try {
                el?.focus({ preventScroll: true } as any);
            } catch {
                el?.focus();
            }
        };
        focusSelected();
        currentPlanIndex;
        const onDocMouseDown = (e: MouseEvent) => {
            const root = dropdownRef.current;
            if (root && !root.contains(e.target as Node)) {
                closeDropdown();
            }
        };
        document.addEventListener('mousedown', onDocMouseDown, true);
        return () => {
            clearTimeout(animTimer);
            document.removeEventListener('mousedown', onDocMouseDown, true);
        };
    }, [isOpen, currentPlanIndex, setIsAnimating, closeDropdown]);


    const handlePlanSelect = (plan: PlanType) => {
        const id = toNum(plan.shopifyId);
        if (id < 0) return console.warn('[DeliveryFrequencyDropdown] Invalid sellingPlanId:', plan.shopifyId);
        setCart({ ...cart, sellingPlanId: id });
        closeDropdown();
    };


    const onTriggerKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
        const key = e.key;
        if (key === 'ArrowDown' || key === 'Enter' || key === ' ' || key === 'Spacebar') {
            e.preventDefault();
            e.stopPropagation();
            openDropdown();
        }
    };

    if (sellingPlans.length <= 1) {
        return (
            <button type="button" aria-disabled="true">
                <span className="uppercase">Deliver Every&nbsp;</span>
                <b>{currentPlan ? formatInterval(currentPlan) : ''}</b>
            </button>
        );
    }

    const menuAutoId = useId();
    const menuId = `delivery-frequency-menu-${menuAutoId}`;

    return (
        <Dropdown
            drop='up'
        >
            <Dropdown.Toggle
                className='cf-frequency-button'
            >
                Every {formatInterval(currentPlan).toLowerCase()}
            </Dropdown.Toggle>
            <Dropdown.Menu>
                {sellingPlans.map((plan: PlanType, index: number) => {
                    const selected = toNum(plan.shopifyId) === cart.sellingPlanId;
                    return (
                        <Dropdown.Item 
                            key={index} 
                            className={ selected ? 'active' : ''}
                            onClick={() => handlePlanSelect(plan)}
                        >
                            {formatInterval(plan).toLowerCase()}
                        </Dropdown.Item>
                    )
                })}
            </Dropdown.Menu>
        </Dropdown>
    );
};

export default Frequency;
