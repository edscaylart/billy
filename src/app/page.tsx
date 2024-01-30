import { UserAuthForm } from "@/components/auth/user-auth-form";
import Dashboard from "@/components/dashboard/dashboard";
import { getServerAuthSession } from "@/server/auth";

export default async function Home() {
  const session = await getServerAuthSession();

  return (
    <>
      {session ? <Dashboard /> : <UserAuthForm />}
    </>
  );
}
