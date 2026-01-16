'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';

export default function TeresaPage() {
  const router = useRouter();
  const locale = useLocale();

  useEffect(() => {
    // Redirect to olivia (the actual login page)
    router.replace(`/${locale}/olivia`);
  }, [router, locale]);

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh',
      fontFamily: 'system-ui, sans-serif'
    }}>
      <p>Redirecting...</p>
    </div>
  );
}
