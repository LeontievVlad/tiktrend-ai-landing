import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@4.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface EarlyAccessRequest {
  name: string;
  email: string;
  niche: string;
  betaAccess: boolean;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email, niche, betaAccess }: EarlyAccessRequest = await req.json();

    console.log("Received early access request:", { name, email, niche, betaAccess });

    // Send notification email to admin
    const adminEmailResponse = await resend.emails.send({
      from: "TikTrend AI <onboarding@resend.dev>",
      to: ["tiktrendai@gmail.com"],
      subject: "New Early Access Request - TikTrend AI",
      html: `
        <h1>New Early Access Request</h1>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>TikTok Niche:</strong> ${niche}</p>
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
        <h1>Thank you for joining TikTrend AI, ${name}!</h1>
        <p>We've received your request for early access to TikTrend AI.</p>
        <p>We're excited to help you grow your TikTok channel in the <strong>${niche}</strong> niche!</p>
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
    console.error("Error in send-early-access function:", error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        success: false 
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
