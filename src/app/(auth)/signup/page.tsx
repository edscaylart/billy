"use client";

import { z } from "zod";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signUp } from "../actions";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ReloadIcon } from "@radix-ui/react-icons";
import Link from "next/link";

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export type IRegisterInput = z.infer<typeof registerSchema>;

export default function SignUpPage() {
  const form = useForm<IRegisterInput>({
    resolver: zodResolver(registerSchema),
  });

  const handleSubmit = async (data: IRegisterInput) => {
    const result = await signUp(data);
  };

  return (
    <div className="container relative flex h-[800px] items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Criar uma conta
          </h1>
          <p className="text-sm text-muted-foreground">
            Informe seu e-mail e senha abaixo para criar uma nova conta
          </p>
        </div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-8 px-4 py-2"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>E-mail</FormLabel>
                  <FormControl>
                    <Input placeholder="E-mail" type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Senha</FormLabel>
                  <FormControl>
                    <Input placeholder="Senha" type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? (
                <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Salvar
            </Button>
          </form>
        </Form>
        <p className="py-4 text-center text-sm text-muted-foreground underline">
          <Link href="/login">Já possui uma conta? Log In</Link>
        </p>
      </div>
    </div>
  );
}
