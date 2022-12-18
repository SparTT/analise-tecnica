import { useSession, getSession, signIn } from "next-auth/react"
import Head from 'next/head'
import Header from "../components/elements/header"
import React, { useState, useEffect } from 'react';
import { Chart } from "../components/crypto/chart"
import { getCookie, fetcher, prepareMultCrypto } from '../components/general-scripts/reusable-scripts'




export async function getServerSideProps(context) {
  
  const session = await getSession(context)
  const cookieHeader = context.req.headers.cookie

  let vsFiat = getCookie(cookieHeader, 'vsCurrency', 'brl')

  return {
    props: { session, vsFiat }
  }

}


export default function Home({ vsFiat, session }) {

  const [ vsCurrency, setVsCurrency ] = useState(vsFiat)

  return (
    <>
      <Head>
        <title>Home</title>
      </Head>
      <Header vsCurrency={vsCurrency} setVsCurrency={setVsCurrency} />
      <div className="container">
        <Chart session={session} vsCurrency={vsCurrency} />
      </div>
    </>
    
  )
}