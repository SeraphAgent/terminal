import { createClient } from "@supabase/supabase-js";
import { StatusBadge } from "@/components/status-badge";
import { TrustScore } from "@/components/trust-score";
import { Search } from "lucide-react";
import { isValidStatus } from "@/lib/types";
import { AnalysisClient } from "./client";

// This is the server component
async function getAgents() {
  try {
    console.log("Starting getAgents with URL:", process.env.NEXT_PUBLIC_SUPABASE_URL);
    
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
      auth: {
        persistSession: false,
      },
    });

    const { data, error } = await supabase
      .from("agents")
      .select("*")
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Supabase error:", error);
      return [];
    }

    console.log("Successfully fetched agents:", data?.length || 0);
    return data || [];
  } catch (error) {
    console.error("Unexpected error in getAgents:", error);
    return [];
  }
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function Analysis() {
  const initialAgents = await getAgents();
  console.log("Rendering Analysis with agents:", initialAgents.length);
  return <AnalysisClient initialAgents={initialAgents} />;
}
