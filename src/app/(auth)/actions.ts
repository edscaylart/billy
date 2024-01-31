"use server";

import { createClient } from "@/utils/supabase/server";
import { cookies, headers } from "next/headers";
import { type IRegisterInput } from "./signup/page";
import { type ILoginInput } from "./login/page";

const supabase = createClient(cookies());
const origin = headers().get("origin");

export const signUp = async (data: IRegisterInput) => {
  "use server";

  const { error } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) {
    return {
      error: error.message,
    };
  }
};

export const signIn = async (data: ILoginInput) => {
  "use server";

  const { error } = await supabase.auth.signInWithPassword({
    email: data.email,
    password: data.password,
  });
  if (error) {
    return {
      error: error.message,
    };
  }
};

export const signOut = async () => {
  "use server";

  const supabase = createClient(cookies());
  await supabase.auth.signOut();
};
