import { SessionProvider } from "next-auth/react"
import Head from "next/head"
import '../stylesheet/global.css'
import Header from '../components/elements/header'
import { useState, useEffect } from "react"
import { getCurrentFiat } from "../components/general-scripts/reusable-scripts"


// dividir isso p/ pages especificas
export default function MyApp({
  Component,
  pageProps
}) {


  const [cryptoStr, setCryptoStr] = useState(null)
  const [ vsCurrency, setVsCurrency ] = useState('brl')

  // fazer cryptoStr funcionar em dashboard
  // talvez mudar método de add, delete, etc de crypto

  // <div>CryptoStr {cryptoStr} {vsCurrency}</div>

  return (
  <SessionProvider session={pageProps.session}>
      <Head>
        <link rel="icon" href="/keyword-research.ico" />
      </Head>
    <Header {...pageProps.session} vsCurrency={vsCurrency} setVsCurrency={setVsCurrency} />
    <Component {...pageProps} cryptoStr={cryptoStr} setCryptoStr={setCryptoStr} vsCurrency={vsCurrency} setVsCurrency={setVsCurrency} />
  </SessionProvider>)
}
