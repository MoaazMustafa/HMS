'use client';

import { useEffect } from 'react';
import AOS from 'aos';

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
