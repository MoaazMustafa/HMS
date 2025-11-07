import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-md text-xs font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-3.5 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-0",
  {
    variants: {
      variant: {
        default: 'bg-primary text-white hover:bg-primary/90 shadow-sm',
        destructive:
          'bg-red-600 text-white hover:bg-red-700 shadow-sm',
        outline:
          'border border-muted bg-transparent hover:bg-foreground text-muted-foreground hover:text-background shadow-sm',
        secondary:
          'bg-background text-muted hover:bg-background shadow-sm',
        ghost:
          'hover:bg-background hover:text-foreground text-muted',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-7 px-3 py-1.5 text-xs',
        sm: 'h-6 px-2.5 py-1 text-xs',
        lg: 'h-8 px-4 py-2 text-sm',
        icon: 'size-7',
        'icon-sm': 'size-6',
        'icon-lg': 'size-8',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : 'button';

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
