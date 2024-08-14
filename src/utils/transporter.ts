import nodemailer from "nodemailer";
import { TRANSPORTER_EMAIL_USER, TRANSPORTER_EMAIL_PASSWORD } from "../config/env"

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: TRANSPORTER_EMAIL_USER, 
    pass: TRANSPORTER_EMAIL_PASSWORD,
  },
});

export { transporter };
