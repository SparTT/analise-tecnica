import { useSession, signIn, signOut } from "next-auth/react"
import { SessionProvider } from "next-auth/react"

import Donut from "../components/crypto/doughnut-chart"

export default (req, res) => {

  return <div className="container">
    <Donut />
  </div>
}