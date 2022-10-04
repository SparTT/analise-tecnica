import { useSession, signIn, signOut } from "next-auth/react"
import { SessionProvider } from "next-auth/react"

export default (req, res) => {
  const { data:session, status } = useSession()

  console.log(session)
  if (session) {
    return <div>user: {session.user.name}</div>
  } else {
    return <div>{status}</div>
  }
}