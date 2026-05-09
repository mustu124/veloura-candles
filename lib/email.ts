import type { Order, OrderItem } from "@prisma/client";
import { formatMoney } from "./utils";

type OrderWithItems = Order & { items: OrderItem[] };

export function orderEmailHtml(order: OrderWithItems) {
  const rows = order.items
    .map(
      (item) => `
      <tr>
        <td style="padding:14px 0;border-bottom:1px solid #eadfce;">${item.name}</td>
        <td style="padding:14px 0;border-bottom:1px solid #eadfce;text-align:center;">${item.quantity}</td>
        <td style="padding:14px 0;border-bottom:1px solid #eadfce;text-align:right;">${formatMoney(item.price * item.quantity)}</td>
      </tr>`
    )
    .join("");

  return `
  <div style="margin:0;padding:34px;background:#100d0a;color:#2b2118;font-family:Inter,Arial,sans-serif;">
    <div style="max-width:720px;margin:auto;background:#fff8ed;border:1px solid #d9b56f;border-radius:22px;overflow:hidden;">
      <div style="padding:34px;background:#16110d;color:#fff8ed;">
        <p style="letter-spacing:.3em;text-transform:uppercase;color:#d9b56f;font-size:12px;">Maison Velora</p>
        <h1 style="font-family:Georgia,serif;font-size:34px;margin:12px 0 0;">New order inquiry</h1>
      </div>
      <div style="padding:34px;">
        <p><strong>Customer:</strong> ${order.customer}</p>
        <p><strong>Email:</strong> ${order.email}</p>
        <p><strong>Phone:</strong> ${order.phone}</p>
        <p><strong>Address:</strong> ${order.address}, ${order.city}, ${order.postalCode}, ${order.country}</p>
        <p><strong>Message:</strong> ${order.message || "None"}</p>
        <p><strong>Timestamp:</strong> ${order.createdAt.toISOString()}</p>
        <table style="width:100%;border-collapse:collapse;margin-top:24px;">
          <thead>
            <tr>
              <th style="text-align:left;padding-bottom:10px;">Product</th>
              <th style="text-align:center;padding-bottom:10px;">Qty</th>
              <th style="text-align:right;padding-bottom:10px;">Amount</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
        <h2 style="text-align:right;font-family:Georgia,serif;margin-top:24px;">Total ${formatMoney(order.total)}</h2>
      </div>
    </div>
  </div>`;
}

export async function sendOwnerOrderEmail(order: OrderWithItems) {
  const to = process.env.OWNER_EMAIL;
  const from = process.env.EMAIL_FROM || "Maison Velora <orders@example.com>";
  if (!to) return { skipped: true };

  const html = orderEmailHtml(order);
  const subject = `New Maison Velora inquiry from ${order.customer}`;

  if (process.env.RESEND_API_KEY) {
    const { Resend } = await import("resend");
    const resend = new Resend(process.env.RESEND_API_KEY);
    return resend.emails.send({ from, to, subject, html });
  }

  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    const nodemailer = await import("nodemailer");
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: Number(process.env.SMTP_PORT) === 465,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
    });
    return transporter.sendMail({ from, to, subject, html });
  }

  return { skipped: true };
}
