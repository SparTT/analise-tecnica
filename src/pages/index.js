import Head from 'next/head'
import Header from '../components/elements/header'
import useSWR from 'swr'

const fetcher = (...args) => fetch(...args).then(res => res.json())

function formatCurrency(number, currency, lang) {

  lang = typeof lang == 'undefined' ? 'pt-BR' : lang
  currency = typeof currency == 'undefined' ? 'BRL' : currency

  const res = new Intl.NumberFormat(lang, { style: 'currency', currency: currency }).format(number)
  return res
}

const fiatPreference = 'brl'

function getData(cryptoId) {
  const { data } = useSWR(`/api/crypto/get-many-crypto?id=${cryptoId}`, fetcher)
  return data
}



function Main() {

  const cryptoIds = 'bitcoin,ethereum,monero,smooth-love-potion,axie-infinity,binancecoin'

  const data = getData(cryptoIds)

  if(!data) return <div>Carregando</div>

  console.log(data)

  return (
    <main>
    <h1 className="title">
      Main Cryptos
    </h1>

    <span className="description">
      As principais cryptos do mercado
    </span>

    <div className="grid">
      {data.map( coin => (
        <div className="card" key={coin.id}>
          <div className='first-part'>
            <img src={`${coin.image.replace('/large/', '/small/')}`}></img>
            <a href={`/crypto/${coin.id}`} target="_blank" rel="noopener"><h3 className='coin-name'>{coin.name}</h3></a>
          </div>
          <div>
            <span className='current-price'>
              {formatCurrency(coin.current_price)} 
            </span>
            <span className={`
              ${['price-change']} ${coin.price_change_percentage_24h < 0 ? ['price-down'] : ['price-up']}
            `}>
              {coin.price_change_percentage_24h.toFixed(2)}%
            </span>
          </div>
        </div>
      ))}
    </div>
    <style jsx>{`
      main {
        padding: 3rem 0;
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 50%;
      }
      .grid {
        width: 100%;
        margin-top: 25px;
        display: grid;
        place-items: center;
        grid-row-gap: 10px;
      }
      .card {
        box-shadow: 1px 1px 9px 1px #0000002e;
        padding-top: 5px;
        padding-right: 15px;
        padding-left: 15px;
        width: 80%;
        border-radius: 5px;
        padding-bottom: 20px;
      }
      a {
        color: black;
        text-decoration: none;
      }
      .coin-name {
        margin-left: 10px;
        font-size: 1.3rem;
      }
      .first-part img {
        width: 35px
      }

      .current-price {
        font-weight: bold;
        font-size: 1.1rem
      }
      .title {
        margin: 0;
        line-height: 1.15;
        font-size: 2.5rem;
      }

      .title,
      .description {
        text-align: center;
      }

      .description {
        line-height: 1.5;
        font-size: 1rem;
      }
      
      @media screen and (max-width: 799px) {
        main {
          width: 100%;
        }
        card {
          width: 100%;
        }
      }

      `}</style>
  </main>
  )
}


export default function Home() {
  return (
    <div>
      <Head>
        <title>Home</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <div className="container">
      <Main />
     

      <style jsx>{`
        .container {
          min-height: 100vh;
          padding: 0 0.5rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }

      `}</style>
    </div>
    </div>
    
  )
}
