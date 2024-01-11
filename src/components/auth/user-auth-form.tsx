"use client";

import { signIn, signOut, useSession } from "next-auth/react"

import { Button } from '@/components/ui/button';
import { useObservable } from "@legendapp/state/react";
import { ReloadIcon } from "@radix-ui/react-icons";


export function UserAuthForm() {
  const { data: session } = useSession()

  const state$ = useObservable({ isLoading: false })

  return (
    <div className="container relative h-[800px] items-center justify-center flex">
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
          {session ? (
            <Button
              variant="outline"
              type="button"
              onClick={() => signOut()}
              disabled={state$.isLoading.get()}
            >
              {state$.isLoading.get() && (
                <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
              )}
              Sign Out
            </Button>
          ) : (
            <Button
              variant="outline"
              type="button"
              onClick={() => signIn()}
              disabled={state$.isLoading.get()}
            >
              {state$.isLoading.get() && (
                <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
              )}
              Sign In
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}