import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { Resend } from "resend";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

// Using a fallback for testing if API key is not yet set
const resend = new Resend(process.env["RESEND_API_KEY"] || "re_dummy_key_for_testing");

export const sendStatusUpdateEmail = createServerFn({ method: "POST" })
  .validator(
    (input: { citizen_id: string; grievance_id: string; title: string; new_status: string }) =>
      z
        .object({
          citizen_id: z.string(),
          grievance_id: z.string(),
          title: z.string(),
          new_status: z.string(),
        })
        .parse(input),
  )
  .handler(async ({ data }) => {
    const { citizen_id, grievance_id, title, new_status } = data;

    if (!process.env["RESEND_API_KEY"]) {
      console.warn("RESEND_API_KEY is not set. Skipping email send.");
      return { success: false, error: "Email provider not configured" };
    }

    try {
      // 1. Fetch user's email from profiles
      const { data: profile, error: profileError } = await supabaseAdmin
        .from("profiles")
        .select("email, full_name")
        .eq("id", citizen_id)
        .maybeSingle();

      if (profileError) throw profileError;
      if (!profile || !profile.email) {
        console.warn("User profile or email not found for citizen_id:", citizen_id);
        return { success: false, error: "User email not found" };
      }

      // 2. Format status nicely
      const formatStatus = (status: string) => {
        return status
          .split("_")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");
      };

      // 3. Send email using Resend
      const { data: emailData, error } = await resend.emails.send({
        from: "Surya JanSeva <noreply@updates.suryajanseva.org>", // Should be replaced with verified domain
        to: profile.email,
        subject: `Update on your Grievance: ${grievance_id}`,
        html: `
          <div style="font-family: sans-serif; max-w: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #2563eb; margin-bottom: 20px;">Surya JanSeva - Status Update</h2>
            <p>Dear ${profile.full_name},</p>
            <p>The status of your registered grievance has been updated by the administration.</p>
            
            <div style="background-color: #f3f4f6; padding: 16px; border-radius: 8px; margin: 24px 0;">
              <p style="margin: 0 0 8px 0;"><strong>Grievance ID:</strong> ${grievance_id}</p>
              <p style="margin: 0 0 8px 0;"><strong>Title:</strong> ${title}</p>
              <p style="margin: 0;"><strong>New Status:</strong> <span style="color: #059669; font-weight: bold; font-size: 16px;">${formatStatus(new_status)}</span></p>
            </div>
            
            <p>You can track the detailed progress of your complaint on the Surya JanSeva portal using your grievance ID.</p>
            <br/>
            <p>Thank you,<br/><strong>Surya JanSeva Team</strong></p>
          </div>
        `,
      });

      if (error) {
        console.error("Resend API error:", error);
        return { success: false, error: error.message };
      }

      return { success: true, data: emailData };
    } catch (err: unknown) {
      console.error("Error sending status update email:", err);
      return { success: false, error: err instanceof Error ? err.message : "Unknown error" };
    }
  });
