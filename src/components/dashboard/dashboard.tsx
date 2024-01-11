import { getServerAuthSession } from "@/server/auth";
import { UserAuthForm } from "../auth/user-auth-form";

export default async function Dashboard() {
  const session = await getServerAuthSession();
  return (
    <>
      {session ? <div>Dashboard</div> : <UserAuthForm />}
    </>
  );
}
