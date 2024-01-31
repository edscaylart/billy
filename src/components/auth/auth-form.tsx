"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";

export function AuthForm() {
  return (
    <div className="container relative flex h-[800px] items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Este é Billy
          </h1>
          <p className="text-sm text-muted-foreground">
            Seu organizador pessoal de contas a pagar
          </p>
        </div>
        <div className="grid gap-6">
          <Link href="/login">
            <Button variant="outline" type="button">
              Log In
            </Button>
          </Link>
          <Link href="/signup">
            <Button variant="outline" type="button">
              Sign Up
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
