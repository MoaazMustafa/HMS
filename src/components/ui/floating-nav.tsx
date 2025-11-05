'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';

import { ThemeToggle } from '../theme-toggle';

import { Button } from './button';

const navItems = [
  { name: 'Home', href: '#home' },
  { name: 'Features', href: '#features' },
  { name: 'Modules', href: '#modules' },
  { name: 'Stats', href: '#stats' },
  { name: 'Contact', href: '#contact' },
];

export function FloatingNav() {
  const [isOpen, setIsOpen] = useState(false);
  const { scrollY } = useScroll();
  const backgroundColor = useTransform(
    scrollY,
    [0, 100],
    ['rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 0.8)'],
  );
  const borderColor = useTransform(
    scrollY,
    [0, 100],
    ['rgba(172, 236, 0, 0)', 'rgba(172, 236, 0, 0.2)'],
  );

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen]);

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsOpen(false);
    }
  };

  return (
    <>
      <motion.nav
        style={{
          backgroundColor,
          borderColor,
        }}
        className="fixed top-0 z-50 w-full border-b backdrop-blur-md"
      >
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-2xl font-bold"
          >
            <span className="text-primary">HMS</span>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-8 md:flex">
            {navItems.map((item, index) => (
              <motion.button
                key={item.name}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => scrollToSection(item.href)}
                className="text-foreground hover:text-primary text-sm font-medium transition-colors"
              >
                {item.name}
              </motion.button>
            ))}
          </div>
          <div className="flex gap-4">
            <ThemeToggle />
            <Button
              size="sm"
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Get Started
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-foreground md:hidden"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <motion.div
        initial={{ opacity: 0, x: '100%' }}
        animate={{
          opacity: isOpen ? 1 : 0,
          x: isOpen ? 0 : '100%',
        }}
        transition={{ type: 'tween', duration: 0.3 }}
        className="bg-background/95 fixed inset-0 z-40 backdrop-blur-lg md:hidden"
      >
        <div className="flex h-full flex-col items-center justify-center gap-8">
          {navItems.map((item) => (
            <button
              key={item.name}
              onClick={() => scrollToSection(item.href)}
              className="text-foreground hover:text-primary text-2xl font-medium transition-colors"
            >
              {item.name}
            </button>
          ))}
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
            Get Started
          </Button>
        </div>
      </motion.div>
    </>
  );
}
