import nodemailer from 'nodemailer';

// Verificación de email con contraseña temporal
export const sendVerificationEmail = async (fullName, email, verificationUrl, temporaryPassword, username) => {
  const subject = "Verify your email - Minna Kattelus Art Gallery";
  const htmlContent = `
    <div style="font-family: 'Cormorant Garamond', serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #2D4A3E;">
      <h1 style="color: #2D4A3E; font-size: 28px; margin-bottom: 20px;">Email Verification</h1>
      
      <p style="font-size: 16px; line-height: 1.6;">Dear <strong>${fullName}</strong>,</p>
      
      <p style="font-size: 16px; line-height: 1.6;">Welcome to Minna Kattelus Art Gallery admin panel. Your account has been created successfully.</p>
      
      <div style="background-color: #F5F3F0; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <p style="margin: 5px 0;"><strong>Username:</strong> ${username}</p>
        <p style="margin: 5px 0;"><strong>Temporary Password:</strong> <code style="background-color: #fff; padding: 5px 10px; border-radius: 4px; color: #C17B6B;">${temporaryPassword}</code></p>
      </div>
      
      <p style="font-size: 14px; color: #6B7280; margin: 15px 0;">⚠️ <strong>Important:</strong> Please change this password immediately after logging in.</p>
      <p style="font-size: 14px; color: #6B7280; margin: 15px 0;">⏰ You have 24 hours to verify your account and change your password.</p>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="${verificationUrl}" style="display: inline-block; padding: 14px 30px; background-color: #2D4A3E; color: white; text-decoration: none; border-radius: 4px; font-size: 16px; font-weight: 500;">Verify Account</a>
      </div>
      
      <p style="font-size: 14px; color: #6B7280; line-height: 1.6;">If you did not request this account, please ignore this email.</p>
      
      <hr style="border: none; border-top: 1px solid #E5E7EB; margin: 30px 0;">
      
      <p style="font-size: 12px; color: #6B7280; text-align: center;">
        © ${new Date().getFullYear()} Minna Kattelus Art Gallery. All rights reserved.<br>
        <a href="https://minnakattelus.art" style="color: #2D4A3E; text-decoration: none;">minnakattelus.art</a>
      </p>
    </div>
  `;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

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
    <div style="font-family: 'Cormorant Garamond', serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #2D4A3E;">
      <h1 style="color: #2D4A3E; font-size: 28px; margin-bottom: 20px;">Password Changed</h1>
      
      <p style="font-size: 16px; line-height: 1.6;">Hi <strong>${fullName}</strong>,</p>
      
      <p style="font-size: 16px; line-height: 1.6;">Your password has been successfully updated for your Minna Kattelus Art Gallery account.</p>
      
      <div style="background-color: #F5F3F0; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <p style="margin: 5px 0;"><strong>Date and time:</strong> ${changeDate}</p>
        <p style="margin: 5px 0;"><strong>IP address:</strong> ${userIp}</p>
        <p style="margin: 5px 0;"><strong>Username:</strong> ${username}</p>
      </div>
      
      <p style="font-size: 14px; line-height: 1.6;">If you made this change, no further action is needed.</p>
      
      <p style="font-size: 14px; color: #C17B6B; line-height: 1.6;">⚠️ <strong>If you did not authorize this change:</strong> Please contact your administrator immediately to secure your account.</p>
      
      <hr style="border: none; border-top: 1px solid #E5E7EB; margin: 30px 0;">
      
      <p style="font-size: 12px; color: #6B7280; text-align: center;">
        © ${new Date().getFullYear()} Minna Kattelus Art Gallery. All rights reserved.<br>
        <a href="https://minnakattelus.art" style="color: #2D4A3E; text-decoration: none;">minnakattelus.art</a>
      </p>
    </div>
  `;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

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
    <div style="font-family: 'Cormorant Garamond', serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #2D4A3E;">
      <h1 style="color: #2D4A3E; font-size: 28px; margin-bottom: 20px;">New Login Detected</h1>
      
      <p style="font-size: 16px; line-height: 1.6;">Hello <strong>${fullName}</strong>,</p>
      
      <p style="font-size: 18px; color: #10b981; font-weight: 500; margin: 20px 0;">✓ You have successfully logged in to Minna Kattelus Art Gallery.</p>
      
      <div style="background-color: #F5F3F0; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <p style="margin: 5px 0;"><strong>Date and time:</strong> ${loginDate}</p>
        <p style="margin: 5px 0;"><strong>IP address:</strong> ${userIp}</p>
        <p style="margin: 5px 0;"><strong>Username:</strong> ${username}</p>
      </div>
      
      <p style="font-size: 14px; line-height: 1.6;">If this was you, no further action is needed.</p>
      
      <p style="font-size: 14px; color: #C17B6B; line-height: 1.6;">⚠️ <strong>If this was not you:</strong> Please contact your administrator immediately to secure your account.</p>
      
      <hr style="border: none; border-top: 1px solid #E5E7EB; margin: 30px 0;">
      
      <p style="font-size: 12px; color: #6B7280; text-align: center;">
        © ${new Date().getFullYear()} Minna Kattelus Art Gallery. All rights reserved.<br>
        <a href="https://minnakattelus.art" style="color: #2D4A3E; text-decoration: none;">minnakattelus.art</a>
      </p>
    </div>
  `;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

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
    <div style="font-family: 'Cormorant Garamond', serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #2D4A3E;">
      <h1 style="color: #dc2626; font-size: 28px; margin-bottom: 20px;">⚠️ Failed Login Attempt</h1>
      
      <p style="font-size: 16px; line-height: 1.6;">Hello <strong>${fullName}</strong>,</p>
      
      <p style="font-size: 18px; color: #dc2626; font-weight: 500; margin: 20px 0;">An unsuccessful login attempt was detected on your account.</p>
      
      <div style="background-color: #fef2f2; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #dc2626;">
        <p style="margin: 5px 0;"><strong>Date and time:</strong> ${failLoginAttemptDate}</p>
        <p style="margin: 5px 0;"><strong>IP address:</strong> ${userIp}</p>
        <p style="margin: 5px 0;"><strong>Username:</strong> ${username}</p>
      </div>
      
      <p style="font-size: 14px; line-height: 1.6;">If this was you, you can safely ignore this email.</p>
      
      <p style="font-size: 14px; color: #dc2626; line-height: 1.6;"><strong>⚠️ If this was not you:</strong> Your account may be compromised. Please contact your administrator immediately and consider changing your password.</p>
      
      <hr style="border: none; border-top: 1px solid #E5E7EB; margin: 30px 0;">
      
      <p style="font-size: 12px; color: #6B7280; text-align: center;">
        © ${new Date().getFullYear()} Minna Kattelus Art Gallery. All rights reserved.<br>
        <a href="https://minnakattelus.art" style="color: #2D4A3E; text-decoration: none;">minnakattelus.art</a>
      </p>
    </div>
  `;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

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
    <div style="font-family: 'Cormorant Garamond', serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #2D4A3E;">
      <h1 style="color: #dc2626; font-size: 28px; margin-bottom: 20px;">🚨 Database Connection Failure</h1>
      
      <p style="font-size: 18px; color: #dc2626; font-weight: 500; margin: 20px 0;">Failed login attempt due to database connection issue.</p>
      
      <div style="background-color: #fef2f2; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #dc2626;">
        <p style="margin: 5px 0;"><strong>Date and time:</strong> ${date}</p>
        <p style="margin: 5px 0;"><strong>IP address:</strong> ${ipAddress}</p>
        <p style="margin: 5px 0;"><strong>Issue:</strong> MongoDB connection unavailable</p>
      </div>
      
      <p style="font-size: 14px; color: #dc2626; line-height: 1.6;"><strong>Action required:</strong> Check MongoDB service status immediately.</p>
      
      <hr style="border: none; border-top: 1px solid #E5E7EB; margin: 30px 0;">
      
      <p style="font-size: 12px; color: #6B7280; text-align: center;">
        © ${new Date().getFullYear()} Minna Kattelus Art Gallery - System Alert
      </p>
    </div>
  `;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  await transporter.sendMail({
    from: `"Minna Kattelus Art Gallery" <${process.env.EMAIL_FROM}>`,
    to: process.env.EMAIL_ADMIN,
    subject: subject,
    html: htmlContent,
  });
};