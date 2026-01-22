'use client';

import { Toaster as SonnerToaster } from 'sonner';

export function Toaster() {
  return (
    <SonnerToaster
      position="top-right"
      expand={false}
      richColors
      closeButton
      duration={4000}
      toastOptions={{
        className: 'sonner-toast',
        style: {
          fontFamily: 'var(--font-sans)',
        },
      }}
    />
  );
}

export { toast } from 'sonner';