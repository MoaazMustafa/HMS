'use client';

import { Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-border/50 bg-background py-12">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="grid gap-8 md:grid-cols-4" data-aos="fade-up">
          {/* Brand */}
          <div className="space-y-4">
            <div className="text-2xl font-bold">
              <span className="text-primary">HMS</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Digital healthcare platform for modern medical practices.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="mb-4 font-semibold text-foreground">Product</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a
                  href="#features"
                  className="transition-colors hover:text-primary"
                >
                  Features
                </a>
              </li>
              <li>
                <a
                  href="#modules"
                  className="transition-colors hover:text-primary"
                >
                  Modules
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="transition-colors hover:text-primary"
                >
                  Pricing
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="transition-colors hover:text-primary"
                >
                  Security
                </a>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="mb-4 font-semibold text-foreground">Resources</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#" className="transition-colors hover:text-primary">
                  Documentation
                </a>
              </li>
              <li>
                <a href="#" className="transition-colors hover:text-primary">
                  API Reference
                </a>
              </li>
              <li>
                <a href="#" className="transition-colors hover:text-primary">
                  Support Center
                </a>
              </li>
              <li>
                <a href="#" className="transition-colors hover:text-primary">
                  Blog
                </a>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="mb-4 font-semibold text-foreground">Company</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#" className="transition-colors hover:text-primary">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="transition-colors hover:text-primary">
                  Careers
                </a>
              </li>
              <li>
                <a href="#contact" className="transition-colors hover:text-primary">
                  Contact
                </a>
              </li>
              <li>
                <a href="#" className="transition-colors hover:text-primary">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border/50 pt-8 text-sm text-muted-foreground md:flex-row">
          <p>© 2025 HMS. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Made with <Heart className="h-4 w-4 fill-primary text-primary" />{' '}
            for Healthcare
          </p>
        </div>
      </div>
    </footer>
  );
}
