import nodemailer from 'nodemailer';
import config from '../config/config.js';

const sendEmail = async ({ email, subject, message }) => {
  try {
    const response = await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: {
          name: "Asif",
          email: config.SENDER_EMAIL,
        },
        to: [
          {
            email: email,
          },
        ],
        subject: subject,
        htmlContent: message,
      },
      {
        headers: {
          "api-key": config.BREVO_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("✅ Email sent successfully");
    console.log(response.data);

  } catch (error) {

    console.error("❌ Email Error");

    if (error.response) {
      console.error(error.response.data);
    } else {
      console.error(error.message);
    }

  }
};

export default sendEmail;