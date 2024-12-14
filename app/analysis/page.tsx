import { createClient } from "@supabase/supabase-js";
import { StatusBadge } from "@/components/status-badge";
import { TrustScore } from "@/components/trust-score";
import { Search } from "lucide-react";
import { isValidStatus } from "@/lib/types";
import { AnalysisClient } from "./client";

// This is the server component
async function getAgents() {
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

  const { data, error } = await supabase.from("agents").select("*");

  if (error) {
    console.error("Error fetching agents:", error);
    return [];
  }

  console.log("Fetched agents:", data);
  return data || [];
}

export default async function Analysis() {
  const initialAgents = await getAgents();

  return <AnalysisClient initialAgents={initialAgents} />;
}
