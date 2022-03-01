
import '../stylesheet/global.css'

// dividir isso p/ pages especificas
export default function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />
}