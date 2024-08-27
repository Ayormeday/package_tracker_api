import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.TRANSPORTER_EMAIL_USER, 
    pass: process.env.TRANSPORTER_EMAIL_PASSWORD,
  },
});

export { transporter };
