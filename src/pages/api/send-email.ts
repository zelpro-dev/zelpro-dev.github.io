import type { APIRoute } from 'astro';
import { Resend } from 'resend';

const resend = new Resend(import.meta.env.RESEND_API_KEY);

export const post: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();

    // Validación de campos
    if (!body.from_name || !body.reply_to || !body.message) {
      return new Response(
        JSON.stringify({ error: 'Faltan campos requeridos' }),
        { status: 400 }
      );
    }

    // Enviar email
    const { data, error } = await resend.emails.send({
      from: 'Portfolio Contact <onboarding@resend.dev>',
      to: 'oscarandreshernandezpineda@gmail.com',
      subject: `Nuevo mensaje de ${body.from_name}`,
      html: `
        <p><strong>Nombre:</strong> ${body.from_name}</p>
        <p><strong>Email:</strong> ${body.reply_to}</p>
        <p><strong>Mensaje:</strong></p>
        <p>${body.message}</p>
      `,
    });

    if (error) {
      return new Response(
        JSON.stringify({ error: error.message }),
        { status: 500 }
      );
    }

    return new Response(
      JSON.stringify({ success: true, data }),
      { status: 200 }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Error interno del servidor' }),
      { status: 500 }
    );
  }
};