'use client';

import { motion, useInView, useSpring, useTransform } from 'framer-motion';
import { useEffect, useRef } from 'react';

interface StatCounterProps {
  value: number;
  label: string;
  suffix?: string;
  prefix?: string;
  delay?: number;
}

export function StatCounter({
  value,
  label,
  suffix = '',
  prefix = '',
  delay = 0,
}: StatCounterProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const motionValue = useSpring(0, { duration: 2000 });
  const rounded = useTransform(motionValue, (latest) => Math.round(latest));

  useEffect(() => {
    if (isInView) {
      setTimeout(() => {
        motionValue.set(value);
      }, delay * 1000);
    }
  }, [isInView, value, delay, motionValue]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={isInView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.5, delay }}
      className="text-center"
    >
      <div className="mb-2 text-4xl font-bold text-primary md:text-5xl">
        {prefix}
        <motion.span>{rounded}</motion.span>
        {suffix}
      </div>
      <div className="text-sm font-medium text-muted-foreground md:text-base">
        {label}
      </div>
    </motion.div>
  );
}
