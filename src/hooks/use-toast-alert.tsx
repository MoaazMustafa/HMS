'use client';

import { CheckCircle2, AlertCircle, Info, XCircle } from 'lucide-react';
import { useState } from 'react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface AlertOptions {
  title?: string;
  message: string;
  type?: 'success' | 'error' | 'info' | 'warning';
}

export function useAlert() {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<AlertOptions>({
    title: 'Notification',
    message: '',
    type: 'info',
  });

  const alert = (messageOrOptions: string | AlertOptions) => {
    if (typeof messageOrOptions === 'string') {
      setOptions({
        title: 'Notification',
        message: messageOrOptions,
        type: 'info',
      });
    } else {
      setOptions(messageOrOptions);
    }
    setIsOpen(true);
  };

  const getIcon = () => {
    switch (options.type) {
      case 'success':
        return <CheckCircle2 className="h-6 w-6 text-green-500" />;
      case 'error':
        return <XCircle className="h-6 w-6 text-red-500" />;
      case 'warning':
        return <AlertCircle className="h-6 w-6 text-yellow-500" />;
      default:
        return <Info className="h-6 w-6 text-blue-500" />;
    }
  };

  const AlertDialog = () => (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            {getIcon()}
            <DialogTitle>{options.title}</DialogTitle>
          </div>
          <DialogDescription className="pt-2">
            {options.message}
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );

  return { alert, AlertDialog };
}
