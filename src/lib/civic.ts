import type { Database } from "@/integrations/supabase/types";

export type ComplaintStatus = Database["public"]["Enums"]["complaint_status"];
export type ComplaintPriority = Database["public"]["Enums"]["complaint_priority"];
export type ComplaintType = Database["public"]["Enums"]["complaint_type"];
export type AppRole = Database["public"]["Enums"]["app_role"];

export const COMPLAINT_TYPES: { value: ComplaintType; label: string; hint: string }[] = [
  {
    value: "public_service",
    label: "Public Service Complaint",
    hint: "Delays, denial or poor quality of a government or public service.",
  },
  {
    value: "civic_infrastructure",
    label: "Civic Infrastructure Issue",
    hint: "Roads, drains, water lines, streetlights, electricity and similar assets.",
  },
  {
    value: "public_facility",
    label: "Public Facility Issue",
    hint: "Parks, toilets, bus stands, libraries, hospitals and public buildings.",
  },
  {
    value: "safety_concern",
    label: "Safety Concern",
    hint: "Hazards that put people at risk of injury or harm.",
  },
  {
    value: "improvement_suggestion",
    label: "Improvement Suggestion",
    hint: "An idea to make a public service or space better.",
  },
  { value: "other", label: "Other", hint: "Anything that does not fit the categories above." },
];

export const STATUS_ORDER: ComplaintStatus[] = [
  "submitted",
  "under_verification",
  "verified",
  "assigned",
  "forwarded",
  "action_initiated",
  "in_progress",
  "resolved",
  "closed",
];

export const STATUS_LABELS: Record<ComplaintStatus, string> = {
  submitted: "Submitted",
  under_verification: "Under Verification",
  verified: "Verified",
  assigned: "Assigned",
  forwarded: "Forwarded",
  action_initiated: "Action Initiated",
  in_progress: "In Progress",
  resolved: "Resolved",
  closed: "Closed",
  rejected: "Rejected",
  duplicate: "Duplicate",
  escalated: "Escalated",
};

export const STATUS_TONE: Record<ComplaintStatus, string> = {
  submitted: "bg-muted text-muted-foreground",
  under_verification: "bg-info/15 text-info",
  verified: "bg-info/15 text-info",
  assigned: "bg-info/15 text-info",
  forwarded: "bg-accent/20 text-accent-foreground",
  action_initiated: "bg-accent/20 text-accent-foreground",
  in_progress: "bg-warning/20 text-warning-foreground",
  resolved: "bg-success/15 text-success",
  closed: "bg-success/15 text-success",
  rejected: "bg-destructive/15 text-destructive",
  duplicate: "bg-muted text-muted-foreground",
  escalated: "bg-destructive/15 text-destructive",
};

export const PRIORITIES: ComplaintPriority[] = ["low", "medium", "high", "critical"];

export const PRIORITY_TONE: Record<ComplaintPriority, string> = {
  low: "bg-muted text-muted-foreground",
  medium: "bg-info/15 text-info",
  high: "bg-warning/20 text-warning-foreground",
  critical: "bg-destructive/15 text-destructive",
};

export const TYPE_LABELS: Record<ComplaintType, string> = {
  public_service: "Public Service Complaint",
  civic_infrastructure: "Civic Infrastructure Issue",
  public_facility: "Public Facility Issue",
  safety_concern: "Safety Concern",
  improvement_suggestion: "Improvement Suggestion",
  other: "Other",
};

export const ROLE_LABELS: Record<AppRole, string> = {
  super_admin: "Super Admin",
  verification_admin: "Verification Admin",
  department_admin: "Department Admin",
  moderator: "Moderator",
  citizen: "Citizen",
};

export const INDIAN_STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Andaman and Nicobar Islands",
  "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi",
  "Jammu and Kashmir",
  "Ladakh",
  "Lakshadweep",
  "Puducherry",
];

export const MAX_FILES = 5;
export const MAX_FILE_BYTES = 15 * 1024 * 1024;
export const ALLOWED_MIME = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/heic",
  "video/mp4",
  "video/quicktime",
  "video/webm",
  "application/pdf",
];

export function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function formatDate(value: string | null | undefined) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function formatDateTime(value: string | null | undefined) {
  if (!value) return "—";
  return new Date(value).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
