import type { Activity } from "@/types/activity";

export interface ActivityRow extends Activity {
  status: "active" | "inactive";
  description: string;
  longDescription: string;
  meetingPoint: string;
};
