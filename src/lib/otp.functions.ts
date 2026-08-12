import { createServerFn } from "@tanstack/react-start";
import * as z from "zod";

const phoneSchema = z.object({
  phone: z.string().trim().regex(/^\+91[6-9]\d{9}$/, "Enter a valid Indian mobile number"),
});

const verifySchema = phoneSchema.extend({
  code: z.string().trim().regex(/^\d{6}$/, "Enter the 6-digit code"),
});

/**
 * DEMO MODE: no SMS provider is configured yet, so the generated code is
 * returned to the client and shown on screen. Swap this for a real SMS send
 * (and stop returning `code`) once a provider is connected.
 */
export const sendPhoneOtp = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => phoneSchema.parse(input))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const since = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const { count } = await supabaseAdmin
      .from("phone_verifications")
      .select("id", { count: "exact", head: true })
      .eq("phone", data.phone)
      .gte("created_at", since);

    if ((count ?? 0) >= 5) {
      throw new Error("Too many codes requested for this number. Please try again later.");
    }

    const code = String(Math.floor(100000 + Math.random() * 900000));
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();

    const { error } = await supabaseAdmin
      .from("phone_verifications")
      .insert({ phone: data.phone, code, expires_at: expiresAt });
    if (error) throw new Error("Could not send the verification code. Please try again.");

    return { sent: true, demoCode: code, expiresAt };
  });

export const verifyPhoneOtp = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => verifySchema.parse(input))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: record } = await supabaseAdmin
      .from("phone_verifications")
      .select("id, code, attempts, expires_at, verified_at")
      .eq("phone", data.phone)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (!record) throw new Error("No code was requested for this number.");
    if (new Date(record.expires_at) < new Date()) {
      throw new Error("This code has expired. Please request a new one.");
    }
    if (record.attempts >= 5) {
      throw new Error("Too many incorrect attempts. Please request a new code.");
    }
    if (record.code !== data.code) {
      await supabaseAdmin
        .from("phone_verifications")
        .update({ attempts: record.attempts + 1 })
        .eq("id", record.id);
      throw new Error("That code is incorrect. Please check and try again.");
    }

    await supabaseAdmin
      .from("phone_verifications")
      .update({ verified_at: new Date().toISOString() })
      .eq("id", record.id);

    return { verified: true };
  });
