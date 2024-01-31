import { cookies } from "next/headers";

import Dashboard from "@/components/dashboard/dashboard";
import { AuthForm } from "@/components/auth/auth-form";
import { createClient } from "@/utils/supabase/server";

export default async function Home() {
  const supabase = createClient(cookies());

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return <>{user ? <Dashboard /> : <AuthForm />}</>;
}
