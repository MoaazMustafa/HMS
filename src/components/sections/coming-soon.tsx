'use client';

import {
  ArrowRight,
  Calendar,
  Clock,
  Mail,
  Sparkles,
  Star,
} from 'lucide-react';
import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface ComingSoonProps {
  title?: string;
  description?: string;
  expectedDate?: string;
  notifyEmail?: string;
}

export default function ComingSoon({
  title = 'Coming Soon',
  description = "We're working hard to bring you something amazing. This page will be available soon with exciting new features and content.",
  expectedDate = 'Q1 2026',
  notifyEmail = 'contactwithmoaaz@gmail.com',
}: ComingSoonProps) {
  return (
    <div className="bg-background min-h-screen">
      {/* Navigation */}
      <div className="bg-background/80 border-border/50 sticky top-0 z-50 border-b backdrop-blur-sm"></div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="mx-auto max-w-4xl text-center">
          {/* Animated Icon */}
          <div className="relative mb-8">
            <div className="from-primary/20 to-primary/10 relative inline-flex rounded-full bg-gradient-to-br p-6">
              <Sparkles className="text-primary h-12 w-12 animate-pulse" />
              <div className="absolute -top-2 -right-2">
                <Star className="fill-primary-400 text-primary-500 h-6 w-6 animate-bounce" />
              </div>
            </div>
          </div>

          {/* Badge */}
          <Badge className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 mb-6 transition-colors">
            <Sparkles className="mr-1 h-3 w-3" />
            Under Development
          </Badge>

          {/* Title */}
          <h1 className="text-foreground mb-6 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            {title}
          </h1>

          {/* Description */}
          <p className="text-muted-foreground mx-auto mb-8 max-w-2xl text-xl leading-relaxed">
            {description}
          </p>

          {/* Timeline Info */}
          <div className="mb-12 flex flex-col items-center justify-center gap-6 sm:flex-row">
            <div className="text-muted-foreground flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              <span className="font-medium">
                Expected Launch: {expectedDate}
              </span>
            </div>
            <div className="text-muted-foreground flex items-center gap-2">
              <Clock className="h-5 w-5" />
              <span>We&apos;re working around the clock</span>
            </div>
          </div>

          {/* Features Preview */}
          <div className="mb-12 grid gap-6 md:grid-cols-3">
            <div className="bg-muted/30 border-border/50 rounded-lg border p-6">
              <div className="bg-primary/10 mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg">
                <Star className="text-primary h-6 w-6" />
              </div>
              <h3 className="mb-2 font-semibold">Amazing Features</h3>
              <p className="text-muted-foreground text-sm">
                Cutting-edge functionality designed with you in mind
              </p>
            </div>
            <div className="bg-muted/30 border-border/50 rounded-lg border p-6">
              <div className="bg-primary/10 mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg">
                <Sparkles className="text-primary h-6 w-6" />
              </div>
              <h3 className="mb-2 font-semibold">Modern Design</h3>
              <p className="text-muted-foreground text-sm">
                Beautiful, responsive interface that works everywhere
              </p>
            </div>
            <div className="bg-muted/30 border-border/50 rounded-lg border p-6">
              <div className="bg-primary/10 mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg">
                <Clock className="text-primary h-6 w-6" />
              </div>
              <h3 className="mb-2 font-semibold">Lightning Fast</h3>
              <p className="text-muted-foreground text-sm">
                Optimized for performance and user experience
              </p>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <ArrowRight className="mr-2 h-4 w-4" />
                Back to Home
              </Button>
            </Link>
            <Link
              href={`mailto:${notifyEmail}?subject=Notify me when ready&body=Hi! Please notify me when this page is ready.`}
            >
              <Button
                variant="outline"
                className="border-primary/20 hover:border-primary/50 hover:bg-primary/10"
              >
                <Mail className="mr-2 h-4 w-4" />
                Notify Me
              </Button>
            </Link>
          </div>

          {/* Footer Note */}
          <div className="border-border/30 mt-16 border-t pt-8">
            <p className="text-muted-foreground text-sm">
              Want to stay updated? Follow us on social media or{' '}
              <Link
                href={`mailto:${notifyEmail}`}
                className="text-primary hover:underline"
              >
                get in touch
              </Link>{' '}
              directly.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
