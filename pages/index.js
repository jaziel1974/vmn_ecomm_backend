import Layout from "@/components/Layout";
import { signIn, signOut, useSession } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();

  return <Layout>
    <div>
      <h1>NextAuth Google Login</h1>
      {session ? (
        <div>
          <p>Welcome, {session.user.name}</p>
          <img src={session.user.image} alt={session.user.name} style={{ borderRadius: "50%" }} />
          <button onClick={() => signOut()}>Logout</button>
        </div>
      ) : (
        <button onClick={() => signIn("google")}>Login with Google</button>
      )}
    </div>
  </Layout>
}
