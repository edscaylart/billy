import { getServerAuthSession } from "@/server/auth";
import { redirect } from "next/navigation";

interface IProtectedLayoutProps {
  children: React.ReactNode;
}

export default async function ProtectedLayout({ children }: IProtectedLayoutProps) {
  const session = await getServerAuthSession()

  if (!session || !session.user) {
    redirect("/")
  }

  return (
    <>{children}</>
  )
}