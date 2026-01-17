import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locales } from '@/i18n';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { AuthContextProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';

import '@/app/globals.css';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export const metadata = {
  title: {
    template: '%s | Minna Kattelus Art Gallery',
    default: 'Minna Kattelus - Art Gallery',
  },
  description: 'Contemporary Finnish Art by Minna Kattelus',
};

export default async function LocaleLayout({ children, params }) {
  const { locale } = await params;

  if (!locales.includes(locale)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider messages={messages}>
          {/* 2. ENVUELVE TODO CON EL PROVIDER DE AUTENTICACIÓN */}
          <AuthContextProvider>
            <CartProvider>
              <Navbar />
              <main>
                {children}
              </main>
              <Footer />
            </CartProvider>
          </AuthContextProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
