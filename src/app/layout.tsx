import "@/styles/globals.css";

import { Inter as FontSans } from "next/font/google";
import { cookies } from "next/headers";

import { TRPCReactProvider } from "@/trpc/react";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/toaster"
import { ThemeProvider } from "@/components/theme-provider";
import { GlobalHeader } from "@/components/global-header";
import { GlobalFooter } from "@/components/global-footer";
import { getServerAuthSession } from '@/server/auth';
import SessionProvider from "@/components/session-provider";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

export const metadata = {
  title: "Billy",
  description: "Billy - Seu controle financeiro",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
  authors: [
    {
      name: "Edson Souza",
      url: "https://scaylart.dev",
    },
  ],
  creator: "edscaylart",
};

export const dynamic = 'force-dynamic'

interface IRootLayoutProps {
  children: React.ReactNode;
}

export default async function RootLayout({ children }: IRootLayoutProps) {
  const session = await getServerAuthSession()

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(
        "min-h-screen bg-background font-sans antialiased",
        fontSans.variable
      )}>
        <TRPCReactProvider cookies={cookies().toString()}>
          <SessionProvider session={session}>
            <ThemeProvider
              attribute="class"
              defaultTheme="dark"
              enableSystem
              disableTransitionOnChange
            >
              <div vaul-drawer-wrapper="">
                <div className="relative flex min-h-screen flex-col bg-background">
                  <GlobalHeader />
                  <main className="flex-1">
                    {children}
                  </main>
                  <GlobalFooter />
                </div>
              </div>
              <Toaster />
            </ThemeProvider>
          </SessionProvider>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
