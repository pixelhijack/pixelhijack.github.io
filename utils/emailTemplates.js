
// Send magic login link email: 
export function generateMagicLinkEmail({projectName, magicLink, email}) {
  return {
    from: `${projectName} <noreply@pothattila.com>`,
    to: email,
    subject: `${projectName}: egyszeri azonosító link`,
    html: `
      <h1>Köszi, mostmár felismerünk! Itt a belépési linked:</h1>
      <p>Végre eljött a jelszók és regisztrációk nélküli kor! Az alábbi linkkel tudni fogjuk, ki vagy, és te is megtalálod a személyes tartalmaidat:</p>
      <p><a href="${magicLink}" style="display: inline-block; padding: 12px 24px; background-color: #000; color: #fff; text-decoration: none; border-radius: 4px;">Vissza az oldalra →</a></p>
      <p><small>A link egy óráig érvényes.</small></p>
      <h2>Miért jó ez neked?</h2>
      <ul>
        <li>Nem kell jelszavakkal bajlódnod</li>
        <li>Gyors és egyszerű hozzáférés a személyes tartalmaidhoz</li>
        <li>Biztonságos és megbízható azonosítás</li>
      </ul>
      <p>Ha nem te kérted ezt a linket, nyugodtan hagyd figyelmen kívül ezt az emailt.</p>
      <p>Üdv,<br/>${projectName}</p>
    `,
  };
}