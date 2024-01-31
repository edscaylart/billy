import { cookies } from "next/headers";

import { createClient } from "@/utils/supabase/server";
import { MainNav } from "./main-nav";
import { UserNav } from "./user-nav";

export async function GlobalHeader() {
  const supabase = createClient(cookies());

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <MainNav user={user} />
        <div className="ml-auto flex items-center space-x-4">
          <UserNav user={user} />
        </div>
      </div>
    </header>
  );
}
