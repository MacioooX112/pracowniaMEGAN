import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

// Pomocnicza funkcja zabezpieczająca wprowadzony tekst przed wstrzyknięciem kodu HTML
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export async function POST(request: Request) {
  try {
    const { name, title, email, message } = await request.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Wypełnij wymagane pola' }, { status: 400 });
    }

    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);
    const safeTitle = escapeHtml(title || 'Zapytanie o kurs');
    const safeMessage = escapeHtml(message).replace(/\n/g, '<br/>');

    const htmlContent = `
      <!DOCTYPE html>
      <html lang="pl">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Nowa wiadomość ze strony</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: #f4f5f7; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1f2937;">
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f4f5f7; padding: 40px 12px;">
          <tr>
            <td align="center">
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);">
                
                <!-- NAGŁÓWEK -->
                <tr>
                  <td style="background: linear-gradient(135deg, #8c3b4a 0%, #6b2633 100%); padding: 32px 32px; text-align: left;">
                    <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; color: #fce7f3; margin-bottom: 8px;">
                      Pracownia Megan • Formularz kontaktowy
                    </div>
                    <h1 style="margin: 0; font-size: 22px; font-weight: 700; color: #ffffff; line-height: 1.3;">
                      ✉️ Nowa wiadomość ze strony
                    </h1>
                  </td>
                </tr>

                <!-- ZAWARTOSC GŁÓWNA -->
                <tr>
                  <td style="padding: 32px;">
                    
                    <!-- DANE NADAWCY -->
                    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 24px;">
                      <tr>
                        <td style="padding: 16px; background-color: #faf5f5; border-radius: 10px; border-left: 4px solid #8c3b4a;">
                          <div style="font-size: 11px; text-transform: uppercase; color: #6b7280; font-weight: 700; letter-spacing: 0.5px; margin-bottom: 4px;">Nadawca</div>
                          <div style="font-size: 16px; font-weight: 700; color: #111827;">${safeName}</div>
                          <div style="font-size: 14px; margin-top: 4px;">
                            <a href="mailto:${safeEmail}" style="color: #8c3b4a; text-decoration: none; font-weight: 600;">${safeEmail}</a>
                          </div>
                        </td>
                      </tr>
                    </table>

                    <!-- TEMAT -->
                    <div style="margin-bottom: 24px;">
                      <div style="font-size: 11px; text-transform: uppercase; color: #6b7280; font-weight: 700; letter-spacing: 0.5px; margin-bottom: 6px;">Temat zapytania</div>
                      <div style="font-size: 15px; font-weight: 600; color: #1f2937; background-color: #f9fafb; padding: 12px 16px; border-radius: 8px; border: 1px solid #e5e7eb;">
                        ${safeTitle}
                      </div>
                    </div>

                    <!-- TREŚĆ WIADOMOŚCI -->
                    <div style="margin-bottom: 32px;">
                      <div style="font-size: 11px; text-transform: uppercase; color: #6b7280; font-weight: 700; letter-spacing: 0.5px; margin-bottom: 6px;">Treść wiadomości</div>
                      <div style="font-size: 15px; line-height: 1.6; color: #374151; background-color: #fafafa; padding: 20px; border-radius: 8px; border: 1px solid #e5e7eb;">
                        ${safeMessage}
                      </div>
                    </div>

                    <!-- PRZYCISK ODPOWIEDZI -->
                    <table width="100%" border="0" cellspacing="0" cellpadding="0">
                      <tr>
                        <td align="center">
                          <a href="mailto:${safeEmail}?subject=Re: ${encodeURIComponent(title || 'Zapytanie o kurs')}" 
                             style="display: inline-block; background-color: #8c3b4a; color: #ffffff; font-weight: 600; font-size: 14px; padding: 14px 32px; border-radius: 8px; text-decoration: none;">
                            Napisz odpowiedź do klienta
                          </a>
                        </td>
                      </tr>
                    </table>

                  </td>
                </tr>

                <!-- STOPKA -->
                <tr>
                  <td style="background-color: #f9fafb; padding: 20px 32px; border-top: 1px solid #e5e7eb; text-align: center; font-size: 12px; color: #6b7280; line-height: 1.5;">
                    Możesz też odpisać klikając przycisk <strong>"Odpowiedz"</strong> w swojej aplikacji pocztowej.<br/>
                    Wiadomość wysłana z formularza na stronie <strong>Pracownia Megan</strong>.
                  </td>
                </tr>

              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;
    
    await resend.emails.send({
      from: 'Formularz Kontaktowy <powiadomienia@pracowniamegan.com>',
      to: 'maciooox112@gmail.com',
      replyTo: email,
      subject: `✉️ [Formularz] ${title || 'Zapytanie o kurs'} – ${name}`,
      text: `Imię i nazwisko: ${name}\nE-mail klienta: ${email}\nTemat: ${title || 'Zapytanie o kurs'}\n\nTreść wiadomości:\n${message}`,
      html: htmlContent,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Błąd podczas wysyłania e-maila:', error);
    return NextResponse.json({ error: 'Błąd podczas wysyłania maila' }, { status: 500 });
  }
}