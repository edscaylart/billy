/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Link from "next/link";

import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/config/site";

interface IMainNavProps {
  user?: any;
}

export function MainNav({ user }: IMainNavProps) {
  const pathname = usePathname();

  return (
    <div className="mr-4 flex">
      <Link href="/" className="mr-6 flex items-center space-x-2">
        {/* <Icons.logo cl /> */}
        <span className="hidden font-bold sm:inline-block">
          {siteConfig.name}
        </span>
      </Link>
      <nav className="flex items-center gap-6 text-sm">
        {user && (
          <Link
            href="/categories"
            className={cn(
              "transition-colors hover:text-foreground/80",
              pathname === "/categories"
                ? "text-foreground"
                : "text-foreground/60",
            )}
          >
            Categorias
          </Link>
        )}
        {user && (
          <Link
            href="/bills"
            className={cn(
              "transition-colors hover:text-foreground/80",
              pathname?.startsWith("/bills")
                ? "text-foreground"
                : "text-foreground/60",
            )}
          >
            Contas a Pagar
          </Link>
        )}
        {user && (
          <Link
            href="/expenses"
            className={cn(
              "transition-colors hover:text-foreground/80",
              pathname?.startsWith("/expenses")
                ? "text-foreground"
                : "text-foreground/60",
            )}
          >
            Despesas
          </Link>
        )}
      </nav>
    </div>
  );
}
