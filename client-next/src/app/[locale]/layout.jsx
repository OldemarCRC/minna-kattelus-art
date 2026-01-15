import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locales } from '@/i18n';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

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
  // Await params in Next.js 15+
  const { locale } = await params;

  // Ensure that the incoming `locale` is valid
  if (!locales.includes(locale)) {
    notFound();
  }


  const messages = await getMessages();

  return (
    <html lang={locale} >
      <body>
        <NextIntlClientProvider messages={messages}>
          <Navbar />
          <main>
            {children}
          </main>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
