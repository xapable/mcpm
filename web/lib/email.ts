// Email notification system
// In production: use Resend, SendGrid, or AWS SES
// For now: stub with console.log, ready for real provider

interface EmailOptions {
  to: string;
  subject: string;
  body: string;
}

export async function sendEmail({ to, subject, body }: EmailOptions) {
  if (process.env.NODE_ENV === "development") {
    console.log(`[EMAIL] To: ${to} | Subject: ${subject}`);
    console.log(`[EMAIL] Body: ${body.slice(0, 200)}...`);
    return { ok: true, preview: true };
  }

  // Production: uncomment and configure
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "mcpm <noreply@mcpm.dev>",
      to,
      subject,
      html: body,
    }),
  });
  return res.json();

  return { ok: true };
}

export function packagePublishedEmail(packageName: string, username: string) {
  return {
    subject: `🎉 ${packageName} is now live on mcpm!`,
    body: `Your package ${packageName} has been published. View it at https://mcpm.dev/package/${packageName}`,
  };
}

export function newVersionEmail(packageName: string, version: string) {
  return {
    subject: `📦 ${packageName} v${version} published`,
    body: `Version ${version} of ${packageName} is now available.`,
  };
}

export function weeklyDigestEmail(topPackages: string[]) {
  return {
    subject: "🔥 This week's top MCP tools",
    body: `Trending this week:\n${topPackages.map((p) => `- ${p}`).join("\n")}`,
  };
}
