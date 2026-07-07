import nodemailer from 'nodemailer';

// Helper: Create reusable transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
};

// Helper: Common email footer
const getEmailFooter = () => `
  <hr style="border: none; border-top: 1px solid #E5E7EB; margin: 30px 0;">
  <p style="font-size: 12px; color: #6B7280; text-align: center;">
    © ${new Date().getFullYear()} Minna Kattelus Art Gallery. All rights reserved.<br>
    <a href="https://minnakattelus.art" style="color: #2D4A3E; text-decoration: none;">minnakattelus.art</a>
  </p>
`;

// Helper: Common email styles
const emailStyles = {
  container: 'font-family: "Cormorant Garamond", Georgia, serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #2D4A3E;',
  heading: 'color: #2D4A3E; font-size: 28px; margin-bottom: 20px;',
  infoBox: 'background-color: #F5F3F0; padding: 20px; border-radius: 8px; margin: 20px 0;',
  contentBox: 'background-color: #fff; padding: 20px; border: 1px solid #E5E7EB; border-radius: 8px; margin: 20px 0;',
  label: 'margin: 5px 0;',
  button: 'display: inline-block; padding: 14px 30px; background-color: #2D4A3E; color: white; text-decoration: none; border-radius: 4px; font-size: 16px; font-weight: 500;',
};

// ============================================
// CUSTOMER-FACING EMAIL TEXTS (per order.locale)
// ============================================
// Only customer-facing emails (order confirmation, refund confirmation) are
// localized. Admin/internal notification emails stay in English.
const EMAIL_TEXTS = {
  en: {
    orderConfirmation: {
      subjectPrefix: 'Order Confirmation',
      thankYou: 'Thank You for Your Order!',
      received: 'Your order has been received and is being processed.',
      orderNumberLabel: 'Order Number',
      orderDetails: 'Order Details',
      itemCol: 'Item',
      priceCol: 'Price',
      subtotal: 'Subtotal',
      shipping: 'Shipping',
      total: 'Total',
      shippingAddress: 'Shipping Address',
      phone: 'Phone',
      paymentMethodTitle: 'Payment Method',
      bankTransfer: 'Bank Transfer',
      creditDebitCard: 'Credit/Debit Card',
      bankTransferDetailsTitle: 'Bank Transfer Details:',
      bankTransferInstructions: 'Please transfer the total amount to:',
      iban: 'IBAN:',
      ibanPending: '[Bank details will be provided]',
      reference: 'Reference:',
      yourNotes: 'Your Notes',
      whatsNext: "What's Next?",
      step1: "We'll review your order and confirm availability",
      step2: "You'll receive payment instructions (if bank transfer)",
      step3: "Once payment is confirmed, we'll prepare your artwork for shipping",
      step4: "You'll receive tracking information when shipped",
      questions: 'Questions about your order?',
      contactUs: 'Contact Us'
    },
    refundConfirmation: {
      subjectPrefix: 'Refund Processed',
      title: 'Your Refund Has Been Processed',
      intro: 'We have processed the refund for your order. Here are the details:',
      orderNumberLabel: 'Order Number',
      amount: 'Refund Amount',
      date: 'Refund Date',
      method: 'Refund Method',
      reference: 'Reference / Transaction Number',
      notes: 'Notes',
      methodNames: { bank_transfer: 'Bank Transfer', credit_card: 'Credit Card', stripe: 'Stripe', other: 'Other' },
      questions: 'Questions about this refund?',
      contactUs: 'Contact Us'
    }
  },
  es: {
    orderConfirmation: {
      subjectPrefix: 'Confirmación de Pedido',
      thankYou: '¡Gracias por tu Pedido!',
      received: 'Hemos recibido tu pedido y lo estamos procesando.',
      orderNumberLabel: 'Número de Pedido',
      orderDetails: 'Detalles del Pedido',
      itemCol: 'Artículo',
      priceCol: 'Precio',
      subtotal: 'Subtotal',
      shipping: 'Envío',
      total: 'Total',
      shippingAddress: 'Dirección de Envío',
      phone: 'Teléfono',
      paymentMethodTitle: 'Método de Pago',
      bankTransfer: 'Transferencia Bancaria',
      creditDebitCard: 'Tarjeta de Crédito/Débito',
      bankTransferDetailsTitle: 'Datos para la Transferencia:',
      bankTransferInstructions: 'Por favor transfiere el monto total a:',
      iban: 'IBAN:',
      ibanPending: '[Los datos bancarios se proporcionarán próximamente]',
      reference: 'Referencia:',
      yourNotes: 'Tus Notas',
      whatsNext: '¿Qué Sigue?',
      step1: 'Revisaremos tu pedido y confirmaremos la disponibilidad',
      step2: 'Recibirás las instrucciones de pago (si elegiste transferencia bancaria)',
      step3: 'Una vez confirmado el pago, prepararemos tu obra para el envío',
      step4: 'Recibirás la información de seguimiento cuando se envíe',
      questions: '¿Tienes preguntas sobre tu pedido?',
      contactUs: 'Contáctanos'
    },
    refundConfirmation: {
      subjectPrefix: 'Devolución Procesada',
      title: 'Tu Devolución Ha Sido Procesada',
      intro: 'Hemos procesado la devolución de tu pedido. Aquí están los detalles:',
      orderNumberLabel: 'Número de Pedido',
      amount: 'Monto Devuelto',
      date: 'Fecha de Devolución',
      method: 'Método de Devolución',
      reference: 'Referencia / Número de Transacción',
      notes: 'Notas',
      methodNames: { bank_transfer: 'Transferencia Bancaria', credit_card: 'Tarjeta de Crédito', stripe: 'Stripe', other: 'Otro' },
      questions: '¿Tienes preguntas sobre esta devolución?',
      contactUs: 'Contáctanos'
    }
  },
  fi: {
    orderConfirmation: {
      subjectPrefix: 'Tilausvahvistus',
      thankYou: 'Kiitos Tilauksestasi!',
      received: 'Tilauksesi on vastaanotettu ja sitä käsitellään.',
      orderNumberLabel: 'Tilausnumero',
      orderDetails: 'Tilauksen Tiedot',
      itemCol: 'Tuote',
      priceCol: 'Hinta',
      subtotal: 'Välisumma',
      shipping: 'Toimitus',
      total: 'Yhteensä',
      shippingAddress: 'Toimitusosoite',
      phone: 'Puhelin',
      paymentMethodTitle: 'Maksutapa',
      bankTransfer: 'Pankkisiirto',
      creditDebitCard: 'Luotto-/Pankkikortti',
      bankTransferDetailsTitle: 'Pankkisiirron Tiedot:',
      bankTransferInstructions: 'Siirrä kokonaissumma tilille:',
      iban: 'IBAN:',
      ibanPending: '[Pankkitiedot toimitetaan myöhemmin]',
      reference: 'Viite:',
      yourNotes: 'Omat Muistiinpanosi',
      whatsNext: 'Mitä Seuraavaksi?',
      step1: 'Tarkistamme tilauksesi ja vahvistamme saatavuuden',
      step2: 'Saat maksuohjeet (jos valitsit pankkisiirron)',
      step3: 'Kun maksu on vahvistettu, valmistelemme teoksesi lähetystä varten',
      step4: 'Saat seurantatiedot, kun tilaus lähetetään',
      questions: 'Kysyttävää tilauksestasi?',
      contactUs: 'Ota Yhteyttä'
    },
    refundConfirmation: {
      subjectPrefix: 'Hyvitys Käsitelty',
      title: 'Hyvityksesi On Käsitelty',
      intro: 'Olemme käsitelleet tilauksesi hyvityksen. Tässä tiedot:',
      orderNumberLabel: 'Tilausnumero',
      amount: 'Hyvityksen Summa',
      date: 'Hyvityksen Päivämäärä',
      method: 'Hyvitystapa',
      reference: 'Viite / Tapahtumanumero',
      notes: 'Muistiinpanot',
      methodNames: { bank_transfer: 'Pankkisiirto', credit_card: 'Luottokortti', stripe: 'Stripe', other: 'Muu' },
      questions: 'Kysyttävää tästä hyvityksestä?',
      contactUs: 'Ota Yhteyttä'
    }
  },
  sv: {
    orderConfirmation: {
      subjectPrefix: 'Orderbekräftelse',
      thankYou: 'Tack för Din Beställning!',
      received: 'Din beställning har mottagits och behandlas.',
      orderNumberLabel: 'Beställningsnummer',
      orderDetails: 'Beställningsdetaljer',
      itemCol: 'Artikel',
      priceCol: 'Pris',
      subtotal: 'Delsumma',
      shipping: 'Frakt',
      total: 'Totalt',
      shippingAddress: 'Leveransadress',
      phone: 'Telefon',
      paymentMethodTitle: 'Betalningsmetod',
      bankTransfer: 'Banköverföring',
      creditDebitCard: 'Kredit-/Betalkort',
      bankTransferDetailsTitle: 'Uppgifter för Banköverföring:',
      bankTransferInstructions: 'Vänligen överför hela beloppet till:',
      iban: 'IBAN:',
      ibanPending: '[Bankuppgifter kommer att tillhandahållas]',
      reference: 'Referens:',
      yourNotes: 'Dina Anteckningar',
      whatsNext: 'Vad Händer Nu?',
      step1: 'Vi granskar din beställning och bekräftar tillgängligheten',
      step2: 'Du får betalningsinstruktioner (vid banköverföring)',
      step3: 'När betalningen är bekräftad förbereder vi ditt konstverk för leverans',
      step4: 'Du får spårningsinformation när beställningen skickas',
      questions: 'Frågor om din beställning?',
      contactUs: 'Kontakta Oss'
    },
    refundConfirmation: {
      subjectPrefix: 'Återbetalning Behandlad',
      title: 'Din Återbetalning Har Behandlats',
      intro: 'Vi har behandlat återbetalningen för din beställning. Här är detaljerna:',
      orderNumberLabel: 'Beställningsnummer',
      amount: 'Återbetalningsbelopp',
      date: 'Återbetalningsdatum',
      method: 'Återbetalningsmetod',
      reference: 'Referens / Transaktionsnummer',
      notes: 'Anteckningar',
      methodNames: { bank_transfer: 'Banköverföring', credit_card: 'Kreditkort', stripe: 'Stripe', other: 'Annat' },
      questions: 'Frågor om denna återbetalning?',
      contactUs: 'Kontakta Oss'
    }
  },
  so: {
    orderConfirmation: {
      subjectPrefix: 'Xaqiijinta Dalabka',
      thankYou: 'Mahadsanid Dalabkaaga!',
      received: 'Dalabkaaga waa la helay waana la habeynayaa.',
      orderNumberLabel: 'Lambarka Dalabka',
      orderDetails: 'Faahfaahinta Dalabka',
      itemCol: 'Alaabta',
      priceCol: 'Qiimaha',
      subtotal: 'Wadarta Hoose',
      shipping: 'Rarka',
      total: 'Wadarta',
      shippingAddress: 'Cinwaanka Rarka',
      phone: 'Taleefanka',
      paymentMethodTitle: 'Habka Lacag-bixinta',
      bankTransfer: 'Wareejinta Bangiga',
      creditDebitCard: 'Kaadhka Deynta/Bangiga',
      bankTransferDetailsTitle: 'Faahfaahinta Wareejinta Bangiga:',
      bankTransferInstructions: 'Fadlan u wareeji wadarta guud:',
      iban: 'IBAN:',
      ibanPending: '[Faahfaahinta bangiga waa la soo diri doonaa]',
      reference: 'Tixraaca:',
      yourNotes: 'Fiirooyinkaaga',
      whatsNext: 'Maxaa Xigaa?',
      step1: 'Waan dib u eegi doonaa dalabkaaga waana xaqiijin doonaa in la heli karo',
      step2: 'Waxaad heli doontaa tilmaamaha lacag-bixinta (haddii aad dooratay wareejinta bangiga)',
      step3: 'Marka lacag-bixinta la xaqiijiyo, waan diyaarin doonaa farshaxankaaga si loo diro',
      step4: 'Waxaad heli doontaa macluumaadka raadraaca marka dalabka la diro',
      questions: "Su'aalo ku saabsan dalabkaaga?",
      contactUs: 'Nala Soo Xiriir'
    },
    refundConfirmation: {
      subjectPrefix: 'Lacag-celin La Habeeyay',
      title: 'Lacag-celintaada Waa La Habeeyay',
      intro: 'Waanu habaynay lacag-celinta dalabkaaga. Faahfaahinta waa kuwan:',
      orderNumberLabel: 'Lambarka Dalabka',
      amount: 'Qadarka Lacag-celinta',
      date: 'Taariikhda Lacag-celinta',
      method: 'Habka Lacag-celinta',
      reference: 'Tixraaca / Lambarka Dhaqdhaqaaqa',
      notes: 'Fiirooyin',
      methodNames: { bank_transfer: 'Wareejinta Bangiga', credit_card: 'Kaadhka Deynta', stripe: 'Stripe', other: 'Kale' },
      questions: "Su'aalo ku saabsan lacag-celintan?",
      contactUs: 'Nala Soo Xiriir'
    }
  }
};

const getEmailTexts = (locale) => EMAIL_TEXTS[locale] || EMAIL_TEXTS.en;

// ============================================
// CONTACT FORM EMAILS
// ============================================

// Enviar mensaje del formulario de contacto (UPDATED - accepts object)
export const sendContactFormEmail = async (data) => {
  const { name, email, subject, message, formType, artworkType, dimensions, budget } = data;
  
  // Determine if this is a commission request
  const isCommission = formType === 'commission';
  
  const emailSubject = isCommission
    ? `🎨 Commission Request - Minna Kattelus Art Gallery`
    : subject 
      ? `Contact Form: ${subject} - Minna Kattelus Art Gallery`
      : "New Contact Form Message - Minna Kattelus Art Gallery";
  
  let htmlContent;
  
  if (isCommission) {
    // Commission-specific email template
    htmlContent = `
      <div style="${emailStyles.container}">
        <h1 style="${emailStyles.heading}">🎨 New Commission Request</h1>
        
        <div style="${emailStyles.infoBox}">
          <p style="${emailStyles.label}"><strong>From:</strong> ${name}</p>
          <p style="${emailStyles.label}"><strong>Email:</strong> <a href="mailto:${email}" style="color: #2D4A3E;">${email}</a></p>
        </div>
        
        <div style="${emailStyles.contentBox}">
          <h3 style="color: #2D4A3E; margin-top: 0;">Commission Details</h3>
          
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #E5E7EB; width: 40%;"><strong>Artwork Type:</strong></td>
              <td style="padding: 10px 0; border-bottom: 1px solid #E5E7EB;">${artworkType || 'Not specified'}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #E5E7EB;"><strong>Dimensions:</strong></td>
              <td style="padding: 10px 0; border-bottom: 1px solid #E5E7EB;">${dimensions || 'Not specified'}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #E5E7EB;"><strong>Budget:</strong></td>
              <td style="padding: 10px 0; border-bottom: 1px solid #E5E7EB;">${budget || 'Not specified'}</td>
            </tr>
          </table>
        </div>
        
        ${message ? `
          <div style="${emailStyles.contentBox}">
            <h3 style="color: #2D4A3E; margin-top: 0;">Additional Details</h3>
            <p style="margin: 0; line-height: 1.6; white-space: pre-wrap;">${message}</p>
          </div>
        ` : ''}
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="mailto:${email}?subject=Re: Your Commission Request" style="${emailStyles.button}">
            Reply to Customer
          </a>
        </div>
        
        ${getEmailFooter()}
      </div>
    `;
  } else {
    // General contact form email template
    htmlContent = `
      <div style="${emailStyles.container}">
        <h1 style="${emailStyles.heading}">New Contact Message</h1>
        
        <div style="${emailStyles.infoBox}">
          <p style="${emailStyles.label}"><strong>From:</strong> ${name}</p>
          <p style="${emailStyles.label}"><strong>Email:</strong> <a href="mailto:${email}" style="color: #2D4A3E;">${email}</a></p>
          ${subject ? `<p style="${emailStyles.label}"><strong>Subject:</strong> ${subject}</p>` : ''}
        </div>
        
        <div style="${emailStyles.contentBox}">
          <p style="margin: 0 0 10px 0;"><strong>Message:</strong></p>
          <p style="margin: 0; line-height: 1.6; white-space: pre-wrap;">${message}</p>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="mailto:${email}?subject=Re: ${subject || 'Your message'}" style="${emailStyles.button}">
            Reply to Customer
          </a>
        </div>
        
        <hr style="border: none; border-top: 1px solid #E5E7EB; margin: 30px 0;">
        
        <p style="font-size: 12px; color: #6B7280; text-align: center;">
          This message was sent from the contact form at minnakattelus.art
        </p>
      </div>
    `;
  }

  const transporter = createTransporter();

  await transporter.sendMail({
    from: `"${isCommission ? 'Commission Request' : 'Contact Form'} - Minna Art" <${process.env.EMAIL_FROM}>`,
    replyTo: email,
    to: process.env.CONTACT_EMAIL || process.env.EMAIL_ADMIN,
    subject: emailSubject,
    html: htmlContent,
  });
};

// ============================================
// ORDER CONFIRMATION EMAIL (NEW)
// ============================================

export const sendOrderConfirmationEmail = async (order) => {
  const {
    orderNumber,
    customer,
    items,
    subtotal,
    shipping,
    total,
    paymentMethod,
    customerNotes,
    locale
  } = order;

  const texts = getEmailTexts(locale).orderConfirmation;

  const emailSubject = `${texts.subjectPrefix} #${orderNumber} - Minna Kattelus Art Gallery`;

  // Generate items HTML
  const itemsHtml = items.map(item => `
    <tr>
      <td style="padding: 15px; border-bottom: 1px solid #E5E7EB;">
        <div style="display: flex; align-items: center;">
          <img 
            src="${process.env.API_URL || 'http://localhost:5000'}/uploads/artworks/${item.image}" 
            alt="${item.title?.en || 'Artwork'}"
            style="width: 80px; height: 80px; object-fit: cover; border-radius: 4px; margin-right: 15px;"
          />
          <div>
            <strong style="color: #2D4A3E;">${item.title?.en || 'Artwork'}</strong>
            ${item.technique?.en ? `<br><span style="color: #6B7280; font-size: 14px;">${item.technique.en}</span>` : ''}
          </div>
        </div>
      </td>
      <td style="padding: 15px; border-bottom: 1px solid #E5E7EB; text-align: right; font-weight: 500;">
        ${item.currency === 'EUR' ? '€' : '$'}${item.price.toFixed(2)}
      </td>
    </tr>
  `).join('');

  const htmlContent = `
    <div style="${emailStyles.container}">
      <!-- Header with checkmark -->
      <div style="text-align: center; margin-bottom: 30px;">
        <div style="width: 60px; height: 60px; background-color: #10b981; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 20px;">
          <span style="color: white; font-size: 30px;">✓</span>
        </div>
        <h1 style="${emailStyles.heading}">${texts.thankYou}</h1>
        <p style="color: #6B7280; font-size: 16px;">${texts.received}</p>
      </div>

      <!-- Order Number -->
      <div style="background-color: #2D4A3E; color: white; padding: 20px; border-radius: 8px; text-align: center; margin-bottom: 30px;">
        <p style="margin: 0; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">${texts.orderNumberLabel}</p>
        <p style="margin: 10px 0 0; font-size: 24px; font-weight: bold;">${orderNumber}</p>
      </div>

      <!-- Order Items -->
      <div style="${emailStyles.contentBox}">
        <h3 style="color: #2D4A3E; margin-top: 0; margin-bottom: 20px;">${texts.orderDetails}</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="background-color: #F5F3F0;">
              <th style="padding: 12px 15px; text-align: left; font-weight: 600;">${texts.itemCol}</th>
              <th style="padding: 12px 15px; text-align: right; font-weight: 600;">${texts.priceCol}</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>

        <!-- Totals -->
        <div style="margin-top: 20px; padding-top: 20px; border-top: 2px solid #E5E7EB;">
          <table style="width: 100%;">
            <tr>
              <td style="padding: 8px 0; color: #6B7280;">${texts.subtotal}:</td>
              <td style="padding: 8px 0; text-align: right;">€${subtotal.toFixed(2)}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #6B7280;">${texts.shipping}:</td>
              <td style="padding: 8px 0; text-align: right;">€${shipping.toFixed(2)}</td>
            </tr>
            <tr style="font-size: 18px; font-weight: bold;">
              <td style="padding: 15px 0; border-top: 2px solid #2D4A3E;">${texts.total}:</td>
              <td style="padding: 15px 0; border-top: 2px solid #2D4A3E; text-align: right; color: #2D4A3E;">€${total.toFixed(2)}</td>
            </tr>
          </table>
        </div>
      </div>

      <!-- Shipping Address -->
      <div style="${emailStyles.infoBox}">
        <h3 style="color: #2D4A3E; margin-top: 0;">${texts.shippingAddress}</h3>
        <p style="margin: 0; line-height: 1.8;">
          ${customer.name}<br>
          ${customer.address}<br>
          ${customer.city}, ${customer.postalCode}<br>
          ${customer.country}
        </p>
        ${customer.phone ? `<p style="margin: 15px 0 0;"><strong>${texts.phone}:</strong> ${customer.phone}</p>` : ''}
      </div>

      <!-- Payment Method -->
      <div style="${emailStyles.infoBox}">
        <h3 style="color: #2D4A3E; margin-top: 0;">${texts.paymentMethodTitle}</h3>
        <p style="margin: 0;">
          ${paymentMethod === 'bank_transfer' ? `🏦 ${texts.bankTransfer}` :
            paymentMethod === 'card' ? `💳 ${texts.creditDebitCard}` :
            paymentMethod}
        </p>
        ${paymentMethod === 'bank_transfer' ? `
          <div style="background-color: #fff; padding: 15px; border-radius: 4px; margin-top: 15px; border-left: 3px solid #2D4A3E;">
            <p style="margin: 0 0 10px; font-weight: bold;">${texts.bankTransferDetailsTitle}</p>
            <p style="margin: 0; font-size: 14px; line-height: 1.8;">
              ${texts.bankTransferInstructions}<br>
              <strong>${texts.iban}</strong> ${texts.ibanPending}<br>
              <strong>${texts.reference}</strong> ${orderNumber}
            </p>
          </div>
        ` : ''}
      </div>

      ${customerNotes ? `
        <!-- Customer Notes -->
        <div style="${emailStyles.contentBox}">
          <h3 style="color: #2D4A3E; margin-top: 0;">${texts.yourNotes}</h3>
          <p style="margin: 0; line-height: 1.6; font-style: italic;">"${customerNotes}"</p>
        </div>
      ` : ''}

      <!-- Next Steps -->
      <div style="${emailStyles.contentBox}">
        <h3 style="color: #2D4A3E; margin-top: 0;">${texts.whatsNext}</h3>
        <ol style="margin: 0; padding-left: 20px; line-height: 2;">
          <li>${texts.step1}</li>
          <li>${texts.step2}</li>
          <li>${texts.step3}</li>
          <li>${texts.step4}</li>
        </ol>
      </div>

      <!-- Contact Info -->
      <div style="text-align: center; margin: 30px 0; padding: 20px; background-color: #F5F3F0; border-radius: 8px;">
        <p style="margin: 0 0 10px; color: #6B7280;">${texts.questions}</p>
        <a href="mailto:${process.env.CONTACT_EMAIL || process.env.EMAIL_ADMIN}" style="color: #2D4A3E; font-weight: bold;">
          ${texts.contactUs}
        </a>
      </div>
      
      ${getEmailFooter()}
    </div>
  `;

  const transporter = createTransporter();

  // Send to customer
  await transporter.sendMail({
    from: `"Minna Kattelus Art Gallery" <${process.env.EMAIL_FROM}>`,
    to: customer.email,
    subject: emailSubject,
    html: htmlContent,
  });

  // Also send notification to admin
  await transporter.sendMail({
    from: `"Order Notification" <${process.env.EMAIL_FROM}>`,
    to: process.env.EMAIL_ADMIN,
    subject: `📦 New Order #${orderNumber} - €${total.toFixed(2)}`,
    html: `
      <div style="${emailStyles.container}">
        <h1 style="${emailStyles.heading}">📦 New Order Received!</h1>
        
        <div style="background-color: #10b981; color: white; padding: 20px; border-radius: 8px; text-align: center; margin-bottom: 30px;">
          <p style="margin: 0; font-size: 14px;">Order Total</p>
          <p style="margin: 10px 0 0; font-size: 32px; font-weight: bold;">€${total.toFixed(2)}</p>
        </div>
        
        <div style="${emailStyles.infoBox}">
          <p style="${emailStyles.label}"><strong>Order Number:</strong> ${orderNumber}</p>
          <p style="${emailStyles.label}"><strong>Customer:</strong> ${customer.name}</p>
          <p style="${emailStyles.label}"><strong>Email:</strong> <a href="mailto:${customer.email}">${customer.email}</a></p>
          <p style="${emailStyles.label}"><strong>Items:</strong> ${items.length} artwork(s)</p>
          <p style="${emailStyles.label}"><strong>Payment Method:</strong> ${paymentMethod}</p>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.CLIENT_URL}/en/dashboard/orders/${order._id || orderNumber}" style="${emailStyles.button}">
            View Order in Dashboard
          </a>
        </div>
        
        ${getEmailFooter()}
      </div>
    `,
  });
};

// ============================================
// REFUND EMAILS
// ============================================

// Notify the customer that their refund has been processed, in their locale
export const sendRefundConfirmationEmail = async (order) => {
  const { orderNumber, customer, locale, refund } = order;
  const texts = getEmailTexts(locale).refundConfirmation;

  const methodLabel = texts.methodNames[refund.method] || refund.method;
  const formattedDate = new Date(refund.date).toLocaleDateString(locale || 'en');

  const emailSubject = `${texts.subjectPrefix} #${orderNumber} - Minna Kattelus Art Gallery`;

  const htmlContent = `
    <div style="${emailStyles.container}">
      <div style="text-align: center; margin-bottom: 30px;">
        <div style="width: 60px; height: 60px; background-color: #10b981; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 20px;">
          <span style="color: white; font-size: 30px;">✓</span>
        </div>
        <h1 style="${emailStyles.heading}">${texts.title}</h1>
        <p style="color: #6B7280; font-size: 16px;">${texts.intro}</p>
      </div>

      <div style="background-color: #2D4A3E; color: white; padding: 20px; border-radius: 8px; text-align: center; margin-bottom: 30px;">
        <p style="margin: 0; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">${texts.orderNumberLabel}</p>
        <p style="margin: 10px 0 0; font-size: 24px; font-weight: bold;">${orderNumber}</p>
      </div>

      <div style="${emailStyles.infoBox}">
        <p style="${emailStyles.label}"><strong>${texts.amount}:</strong> €${Number(refund.amount).toFixed(2)}</p>
        <p style="${emailStyles.label}"><strong>${texts.date}:</strong> ${formattedDate}</p>
        <p style="${emailStyles.label}"><strong>${texts.method}:</strong> ${methodLabel}</p>
        <p style="${emailStyles.label}"><strong>${texts.reference}:</strong> ${refund.reference}</p>
        ${refund.notes ? `<p style="${emailStyles.label}"><strong>${texts.notes}:</strong> ${refund.notes}</p>` : ''}
      </div>

      <div style="text-align: center; margin: 30px 0; padding: 20px; background-color: #F5F3F0; border-radius: 8px;">
        <p style="margin: 0 0 10px; color: #6B7280;">${texts.questions}</p>
        <a href="mailto:${process.env.CONTACT_EMAIL || process.env.EMAIL_ADMIN}" style="color: #2D4A3E; font-weight: bold;">
          ${texts.contactUs}
        </a>
      </div>

      ${getEmailFooter()}
    </div>
  `;

  const transporter = createTransporter();

  await transporter.sendMail({
    from: `"Minna Kattelus Art Gallery" <${process.env.EMAIL_FROM}>`,
    to: customer.email,
    subject: emailSubject,
    html: htmlContent,
  });
};

// Notify the admin (CONTACT_EMAIL) that a refund was registered - internal use, English only
export const sendRefundNotificationEmail = async (order, processedBy) => {
  const { orderNumber, customer, refund } = order;
  const formattedDate = new Date(refund.date).toLocaleDateString('en');

  const htmlContent = `
    <div style="${emailStyles.container}">
      <h1 style="${emailStyles.heading}">💸 Refund Registered</h1>

      <div style="background-color: #10b981; color: white; padding: 20px; border-radius: 8px; text-align: center; margin-bottom: 30px;">
        <p style="margin: 0; font-size: 14px;">Refund Amount</p>
        <p style="margin: 10px 0 0; font-size: 32px; font-weight: bold;">€${Number(refund.amount).toFixed(2)}</p>
      </div>

      <div style="${emailStyles.infoBox}">
        <p style="${emailStyles.label}"><strong>Order Number:</strong> ${orderNumber}</p>
        <p style="${emailStyles.label}"><strong>Customer:</strong> ${customer.name}</p>
        <p style="${emailStyles.label}"><strong>Email:</strong> <a href="mailto:${customer.email}">${customer.email}</a></p>
        <p style="${emailStyles.label}"><strong>Refund Date:</strong> ${formattedDate}</p>
        <p style="${emailStyles.label}"><strong>Method:</strong> ${refund.method}</p>
        <p style="${emailStyles.label}"><strong>Reference:</strong> ${refund.reference}</p>
        ${refund.notes ? `<p style="${emailStyles.label}"><strong>Notes:</strong> ${refund.notes}</p>` : ''}
        <p style="${emailStyles.label}"><strong>Processed By:</strong> ${processedBy?.username || processedBy?.email || 'Unknown'}</p>
      </div>

      <div style="text-align: center; margin: 30px 0;">
        <a href="${process.env.CLIENT_URL}/en/dashboard/orders/${order._id || orderNumber}" style="${emailStyles.button}">
          View Order in Dashboard
        </a>
      </div>

      ${getEmailFooter()}
    </div>
  `;

  const transporter = createTransporter();

  await transporter.sendMail({
    from: `"Refund Notification" <${process.env.EMAIL_FROM}>`,
    to: process.env.CONTACT_EMAIL || process.env.EMAIL_ADMIN,
    subject: `💸 Refund Registered - Order #${orderNumber} - €${Number(refund.amount).toFixed(2)}`,
    html: htmlContent,
  });
};

// ============================================
// EXISTING FUNCTIONS (preserved)
// ============================================

// Verificación de email con contraseña temporal
export const sendVerificationEmail = async (fullName, email, verificationUrl, temporaryPassword, username) => {
  const subject = "Verify your email - Minna Kattelus Art Gallery";
  const htmlContent = `
    <div style="${emailStyles.container}">
      <h1 style="${emailStyles.heading}">Email Verification</h1>
      
      <p style="font-size: 16px; line-height: 1.6;">Dear <strong>${fullName}</strong>,</p>
      
      <p style="font-size: 16px; line-height: 1.6;">Welcome to Minna Kattelus Art Gallery admin panel. Your account has been created successfully.</p>
      
      <div style="${emailStyles.infoBox}">
        <p style="${emailStyles.label}"><strong>Username:</strong> ${username}</p>
        <p style="${emailStyles.label}"><strong>Temporary Password:</strong> <code style="background-color: #fff; padding: 5px 10px; border-radius: 4px; color: #C17B6B;">${temporaryPassword}</code></p>
      </div>
      
      <p style="font-size: 14px; color: #6B7280; margin: 15px 0;">⚠️ <strong>Important:</strong> Please change this password immediately after logging in.</p>
      <p style="font-size: 14px; color: #6B7280; margin: 15px 0;">⏰ You have 24 hours to verify your account and change your password.</p>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="${verificationUrl}" style="${emailStyles.button}">Verify Account</a>
      </div>
      
      <p style="font-size: 14px; color: #6B7280; line-height: 1.6;">If you did not request this account, please ignore this email.</p>
      
      ${getEmailFooter()}
    </div>
  `;

  const transporter = createTransporter();

  await transporter.sendMail({
    from: `"Minna Kattelus Art Gallery" <${process.env.EMAIL_FROM}>`,
    to: email,
    bcc: process.env.EMAIL_BCC,
    subject: subject,
    html: htmlContent,
  });
};

// Notificación de cambio de contraseña
export const sendPasswordChangeNotification = async (email, fullName, username, changeDate, userIp) => {
  const subject = "Password Changed - Minna Kattelus Art Gallery";
  const htmlContent = `
    <div style="${emailStyles.container}">
      <h1 style="${emailStyles.heading}">Password Changed</h1>
      
      <p style="font-size: 16px; line-height: 1.6;">Hi <strong>${fullName}</strong>,</p>
      
      <p style="font-size: 16px; line-height: 1.6;">Your password has been successfully updated for your Minna Kattelus Art Gallery account.</p>
      
      <div style="${emailStyles.infoBox}">
        <p style="${emailStyles.label}"><strong>Date and time:</strong> ${changeDate}</p>
        <p style="${emailStyles.label}"><strong>IP address:</strong> ${userIp}</p>
        <p style="${emailStyles.label}"><strong>Username:</strong> ${username}</p>
      </div>
      
      <p style="font-size: 14px; line-height: 1.6;">If you made this change, no further action is needed.</p>
      
      <p style="font-size: 14px; color: #C17B6B; line-height: 1.6;">⚠️ <strong>If you did not authorize this change:</strong> Please contact your administrator immediately to secure your account.</p>
      
      ${getEmailFooter()}
    </div>
  `;

  const transporter = createTransporter();

  await transporter.sendMail({
    from: `"Minna Kattelus Art Gallery" <${process.env.EMAIL_FROM}>`,
    to: email,
    bcc: process.env.EMAIL_BCC,
    subject: subject,
    html: htmlContent,
  });
};

// Notificación de inicio de sesión exitoso
export const sendLoginNotification = async (email, fullName, username, loginDate, userIp) => {
  const subject = "New Login Detected - Minna Kattelus Art Gallery";
  const htmlContent = `
    <div style="${emailStyles.container}">
      <h1 style="${emailStyles.heading}">New Login Detected</h1>
      
      <p style="font-size: 16px; line-height: 1.6;">Hello <strong>${fullName}</strong>,</p>
      
      <p style="font-size: 18px; color: #10b981; font-weight: 500; margin: 20px 0;">✔ You have successfully logged in to Minna Kattelus Art Gallery.</p>
      
      <div style="${emailStyles.infoBox}">
        <p style="${emailStyles.label}"><strong>Date and time:</strong> ${loginDate}</p>
        <p style="${emailStyles.label}"><strong>IP address:</strong> ${userIp}</p>
        <p style="${emailStyles.label}"><strong>Username:</strong> ${username}</p>
      </div>
      
      <p style="font-size: 14px; line-height: 1.6;">If this was you, no further action is needed.</p>
      
      <p style="font-size: 14px; color: #C17B6B; line-height: 1.6;">⚠️ <strong>If this was not you:</strong> Please contact your administrator immediately to secure your account.</p>
      
      ${getEmailFooter()}
    </div>
  `;

  const transporter = createTransporter();

  await transporter.sendMail({
    from: `"Minna Kattelus Art Gallery" <${process.env.EMAIL_FROM}>`,
    to: email,
    bcc: process.env.EMAIL_BCC,
    subject: subject,
    html: htmlContent,
  });
};

// Notificación de intento fallido de login
export const sendFailLoginNotification = async (email, fullName, username, failLoginAttemptDate, userIp) => {
  const subject = "Failed Login Attempt - Minna Kattelus Art Gallery";
  const htmlContent = `
    <div style="${emailStyles.container}">
      <h1 style="color: #dc2626; font-size: 28px; margin-bottom: 20px;">⚠️ Failed Login Attempt</h1>
      
      <p style="font-size: 16px; line-height: 1.6;">Hello <strong>${fullName}</strong>,</p>
      
      <p style="font-size: 18px; color: #dc2626; font-weight: 500; margin: 20px 0;">An unsuccessful login attempt was detected on your account.</p>
      
      <div style="background-color: #fef2f2; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #dc2626;">
        <p style="${emailStyles.label}"><strong>Date and time:</strong> ${failLoginAttemptDate}</p>
        <p style="${emailStyles.label}"><strong>IP address:</strong> ${userIp}</p>
        <p style="${emailStyles.label}"><strong>Username:</strong> ${username}</p>
      </div>
      
      <p style="font-size: 14px; line-height: 1.6;">If this was you, you can safely ignore this email.</p>
      
      <p style="font-size: 14px; color: #dc2626; line-height: 1.6;"><strong>⚠️ If this was not you:</strong> Your account may be compromised. Please contact your administrator immediately and consider changing your password.</p>
      
      ${getEmailFooter()}
    </div>
  `;

  const transporter = createTransporter();

  await transporter.sendMail({
    from: `"Minna Kattelus Art Gallery" <${process.env.EMAIL_FROM}>`,
    to: email,
    bcc: process.env.EMAIL_BCC,
    subject: subject,
    html: htmlContent,
  });
};

// Notificación de fallo de conexión a la base de datos
export const sendDBConnectionFailureNotification = async (date, ipAddress) => {
  const subject = "🚨 Database Connection Failure - Minna Kattelus Art Gallery";
  const htmlContent = `
    <div style="${emailStyles.container}">
      <h1 style="color: #dc2626; font-size: 28px; margin-bottom: 20px;">🚨 Database Connection Failure</h1>
      
      <p style="font-size: 18px; color: #dc2626; font-weight: 500; margin: 20px 0;">Failed login attempt due to database connection issue.</p>
      
      <div style="background-color: #fef2f2; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #dc2626;">
        <p style="${emailStyles.label}"><strong>Date and time:</strong> ${date}</p>
        <p style="${emailStyles.label}"><strong>IP address:</strong> ${ipAddress}</p>
        <p style="${emailStyles.label}"><strong>Issue:</strong> MongoDB connection unavailable</p>
      </div>
      
      <p style="font-size: 14px; color: #dc2626; line-height: 1.6;"><strong>Action required:</strong> Check MongoDB service status immediately.</p>
      
      <hr style="border: none; border-top: 1px solid #E5E7EB; margin: 30px 0;">
      
      <p style="font-size: 12px; color: #6B7280; text-align: center;">
        © ${new Date().getFullYear()} Minna Kattelus Art Gallery - System Alert
      </p>
    </div>
  `;

  const transporter = createTransporter();

  await transporter.sendMail({
    from: `"Minna Kattelus Art Gallery" <${process.env.EMAIL_FROM}>`,
    to: process.env.EMAIL_ADMIN,
    subject: subject,
    html: htmlContent,
  });
};