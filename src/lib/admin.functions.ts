import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import type { Database } from "@/integrations/supabase/types";

export const updateComplaintStatusAdmin = createServerFn({ method: "POST" })
  .validator(
    (input: { id: string; status: string }) =>
      z
        .object({
          id: z.string(),
          status: z.string(),
        })
        .parse(input),
  )
  .handler(async ({ data }) => {
    const { id, status } = data;
    
    // Using supabaseAdmin to bypass RLS
    const { data: updateData, error } = await supabaseAdmin
      .from("complaints")
      .update({
        status: status as Database["public"]["Enums"]["complaint_status"],
        ...(status === "resolved" || status === "closed"
          ? { resolved_at: new Date().toISOString() }
          : {}),
      })
      .eq("id", id)
      .select();

    if (error) {
      return { success: false, error: error.message };
    }
    
    if (!updateData || updateData.length === 0) {
      return { success: false, error: "Complaint not found or update failed." };
    }

    return { success: true, data: updateData[0] };
  });
