import { SessionProvider } from "next-auth/react"
import Head from "next/head"
import '../stylesheet/globals.css'
import { Analytics } from '@vercel/analytics/react';


// dividir isso p/ pages especificas
export default function MyApp({
  Component,
  pageProps
}) {


  //const [ vsCurrency, setVsCurrency ] = useState('brl')

  // fazer cryptoStr funcionar em dashboard
  // talvez mudar método de add, delete, etc de crypto

  // <div>CryptoStr {cryptoStr} {vsCurrency}</div>

  //  <Header {...pageProps.session} vsCurrency={vsCurrency} setVsCurrency={setVsCurrency} />

  return (
  <SessionProvider session={pageProps.session}>
    <Analytics />
    <Head>
      <link rel="icon" href="/keyword-research.ico" />
    </Head>
    <Component {...pageProps} />
  </SessionProvider>)
}
