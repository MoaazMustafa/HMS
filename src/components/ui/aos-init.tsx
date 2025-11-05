'use client';

import AOS from 'aos';
import { useEffect } from 'react';

export function AOSInit() {
  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: 'ease-in-out',
      once: false,
      offset: 100,
      delay: 50,
    });
  }, []);

  return null;
}
