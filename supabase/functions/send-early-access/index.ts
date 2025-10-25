import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@4.0.0";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// Input validation schema
const earlyAccessSchema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(255),
  niche: z.string().trim().min(1).max(200),
  betaAccess: z.boolean(),
});

// Simple in-memory rate limiting (per IP)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW = 60000; // 1 minute
const MAX_REQUESTS = 3; // 3 requests per minute

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || now > record.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
    return true;
  }

  if (record.count >= MAX_REQUESTS) {
    return false;
  }

  record.count++;
  return true;
}

// HTML escape function to prevent XSS
function escapeHtml(unsafe: string): string {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Rate limiting
    const ip = req.headers.get("x-forwarded-for") || "unknown";
    if (!checkRateLimit(ip)) {
      console.log("Rate limit exceeded for IP:", ip);
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: "Too many requests. Please try again later." 
        }), 
        {
          status: 429,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders,
          },
        }
      );
    }

    // Parse and validate input
    const body = await req.json();
    const validationResult = earlyAccessSchema.safeParse(body);

    if (!validationResult.success) {
      console.log("Validation failed:", validationResult.error);
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: "Invalid input data." 
        }), 
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders,
          },
        }
      );
    }

    const { name, email, niche, betaAccess } = validationResult.data;

    console.log("Received early access request:", { email, niche, betaAccess });

    // Escape user input for HTML
    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);
    const safeNiche = escapeHtml(niche);

    // Send notification email to admin
    const adminEmailResponse = await resend.emails.send({
      from: "TikTrend AI <onboarding@resend.dev>",
      to: ["tiktrendai@gmail.com"],
      subject: "New Early Access Request - TikTrend AI",
      html: `
        <h1>New Early Access Request</h1>
        <p><strong>Name:</strong> ${safeName}</p>
        <p><strong>Email:</strong> ${safeEmail}</p>
        <p><strong>TikTok Niche:</strong> ${safeNiche}</p>
        <p><strong>Beta Access:</strong> ${betaAccess ? "Yes" : "No"}</p>
        <hr>
        <p><em>Submitted at: ${new Date().toLocaleString()}</em></p>
      `,
    });

    console.log("Admin email sent successfully:", adminEmailResponse);

    // Send confirmation email to user
    const userEmailResponse = await resend.emails.send({
      from: "TikTrend AI <onboarding@resend.dev>",
      to: [email],
      subject: "Welcome to TikTrend AI - Early Access Confirmed!",
      html: `
        <h1>Thank you for joining TikTrend AI, ${safeName}!</h1>
        <p>We've received your request for early access to TikTrend AI.</p>
        <p>We're excited to help you grow your TikTok channel in the <strong>${safeNiche}</strong> niche!</p>
        <p>Our team will review your application and get back to you soon with next steps.</p>
        <br>
        <p>In the meantime, feel free to reply to this email if you have any questions.</p>
        <br>
        <p>Best regards,<br><strong>The TikTrend AI Team</strong></p>
      `,
    });

    console.log("User confirmation email sent successfully:", userEmailResponse);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Early access request submitted successfully" 
      }), 
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  } catch (error: any) {
    // Log detailed error server-side
    console.error("Error in send-early-access function:", error);
    
    // Return generic error to client
    return new Response(
      JSON.stringify({ 
        success: false,
        message: "An error occurred while processing your request. Please try again later."
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
