export default async function RegisterPage() {
  return (
    <form className="flex flex-col gap-2 mx-auto max-w-md mt-10">
      <input className="border border-black" type="email" name="email" placeholder="Email" />
      <input className="border border-black" type="password" name="password" placeholder="Password" />
      <button type="submit">Register</button>
    </form>
  )
}