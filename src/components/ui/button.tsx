import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-md text-xs font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-3.5 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-0",
  {
    variants: {
      variant: {
        default: 'bg-primary text-black hover:bg-primary/90 shadow-sm',
        destructive:
          'bg-red-600 text-white hover:bg-red-700 shadow-sm',
        outline:
          'border border-zinc-700 bg-transparent hover:bg-zinc-800 text-zinc-300 hover:text-white shadow-sm',
        secondary:
          'bg-zinc-800 text-zinc-200 hover:bg-zinc-700 shadow-sm',
        ghost:
          'hover:bg-zinc-800 hover:text-white text-zinc-400',
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
