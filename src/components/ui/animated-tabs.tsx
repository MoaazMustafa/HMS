'use client';

import Link from 'next/link';
import { useState } from 'react';

import { cn } from '@/lib/utils';

type Tab = {
  title: string;
  value: string;
  href?: string;
};

export const Tabs = ({
  tabs: propTabs,
  containerClassName,
  activeTabClassName,
  tabClassName,
  onTabChange,
}: {
  tabs: Tab[];
  containerClassName?: string;
  activeTabClassName?: string;
  tabClassName?: string;
  onTabChange?: (value: string) => void;
}) => {
  const [active, setActive] = useState<Tab>(propTabs[0]);

  const handleTabClick = (tab: Tab) => {
    setActive(tab);
    onTabChange?.(tab.value);
  };

  return (
    <>
      <div
        className={cn(
          'fluid-glass no-visible-scrollbar border-border/50 bg-background/60 relative flex w-full max-w-full flex-row items-center justify-start overflow-auto rounded-2xl border shadow-lg backdrop-blur-lg sm:overflow-visible',
          containerClassName,
        )}
      >
        {propTabs.map((tab) => (
          <Link
            key={tab.value}
            href={tab.href || '/'}
            scroll={tab.href?.startsWith('#') ? false : true}
            className={cn(
              'relative rounded-full px-4 py-2 text-sm font-medium transition-colors',
              tabClassName,
              active.value === tab.value
                ? cn(
                    'bg-primary/10 dark:bg-primary/20 border-primary/40 text-primary border font-semibold',
                    activeTabClassName,
                  )
                : 'text-foreground/60 hover:text-primary',
            )}
            onClick={() => handleTabClick(tab)}
          >
            {tab.title}
          </Link>
        ))}
      </div>
    </>
  );
};
