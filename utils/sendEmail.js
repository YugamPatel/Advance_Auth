// ========================
// Nodemailer Configuration
// ========================

import nodemailer from "nodemailer";

/**
 * sendEmail Function
 * Sends an email using nodemailer.
 *
 * @param {Object} options - Email configuration options.
 * @param {string} options.to - The recipient's email address.
 * @param {string} options.subject - The email subject.
 * @param {string} options.text - The email content in HTML format.
 */
export const sendEmail = (options) => {
  // Create a nodemailer transporter for sending emails
  const transporter = nodemailer.createTransport({
    service: "gmail", // You can also use other SMTP services here
    auth: {
      user: process.env.EMAIL_USER, // Your email address
      pass: process.env.EMAIL_PASSWORD, // Your email password or App Password
    },
  });

  // Email configuration options
  const mailOptions = {
    from: process.env.EMAIL_FROM, // Sender's email address
    to: options.to, // Recipient's email address
    subject: options.subject, // Email subject
    html: options.text, // HTML content of the email
  };

  // Send the email
  transporter.sendMail(mailOptions, function (err, info) {
    if (err) {
      console.error(err); // Log any errors
    } else {
        console.log({
            success: true,
            information : "mail sent successfully",
            to : options.to, 
        })
    }
  });
};
