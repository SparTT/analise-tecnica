import Head from 'next/head'
import Header from '../components/elements/header'
import useSWR from 'swr'
import { formatCurrency, fetcher } from '../components/general-scripts/reusable-scripts'


const fiatPreference = 'brl'

function getData(cryptoId) {
  const { data } = useSWR(`/api/crypto/get-many-crypto?id=${cryptoId}`, fetcher)
  return data
}



function Main() {

  const cryptoIds = 'bitcoin,ethereum,monero,smooth-love-potion,axie-infinity,binancecoin,usd-coin,solana,polkadot,dogecoin,litecoin,gala,bomber-coin'

  const data = getData(cryptoIds)

  if(!data) return <div>Carregando</div>

  console.log(data)

  return (
    <main>
    <h1 className="title">
      Main Cryptos
    </h1>

    <span className="description">
      um textinho de descrição
    </span>

    <div className='coin-table'>
      <div className='grid-header'>
        <div className='col-1'>Nome</div>
        <div className='col-2'>Preço</div>
        <div className='col-3 text-center'>1h</div>
        <div className='col-4 text-center'>24h</div>
        <div className='col-5 text-center'>7d</div>
        <div className='col-6 text-center'>30d</div>
        <div className='col-7 text-center'>Market Cap</div>
      </div>
      <div className="grid">
        {data.map( coin => (
          <div className="card" key={coin.id}>
            <div className='col-1'>
              <div className='name-and-icon'>
                <img src={`${coin.image.replace('/large/', '/small/')}`} draggable='false'></img>
                <a href={`/crypto/${coin.id}`}><span className='coin-name'>{coin.name}</span></a>
              </div>
            </div>
            <div className='col-2'>
              <span className='current-price'>
                {formatCurrency(coin.current_price)} 
              </span>
            </div>
            <div className='col-3 text-center'>
              <span className={`${['price-change']} ${coin.price_change_percentage_1h_in_currency < 0 ? ['price-down'] : ['price-up']}`}>
                {coin.price_change_percentage_1h_in_currency}%
              </span>
            </div>  
            <div className='col-4 text-center'>
              <span className={`${['price-change']} ${coin.price_change_percentage_24h_in_currency < 0 ? ['price-down'] : ['price-up']}`}>
                {coin.price_change_percentage_24h_in_currency}%
              </span>
            </div>  
            <div className='col-5 text-center'>
              <span className={`${['price-change']} ${coin.price_change_percentage_7d_in_currency < 0 ? ['price-down'] : ['price-up']}`}>
                {coin.price_change_percentage_7d_in_currency}%
              </span>
            </div>  
            <div className='col-6 text-center'>
              <span className={`${['price-change']} ${coin.price_change_percentage_30d_in_currency < 0 ? ['price-down'] : ['price-up']}`}>
                {coin.price_change_percentage_30d_in_currency}%
              </span>
            </div>  
            <div className='col-7 text-center'>
              <span>{formatCurrency(coin.market_cap)}</span>
            </div>  
          </div>
        ))}
      </div>
    </div>

    <style jsx>{`
      main {
        padding: 1rem 0;
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 100%;
        max-width: 1300px;
      }

      .coin-table {
        width: 90%;
        margin-left: auto;
        margin-right: auto;
        margin-top: 4rem;
        box-shadow: 1px 1px 10px 1px #00000014;
        border-radius: 5px;
      }

      .grid {
        width: 100%;
        display: grid;
        place-items: center;
        grid-row-gap: 10px;
      }


      .grid-header, .card {
        display: grid;
        grid-template-areas:
            "name price 1h 24h 7d 30d market-cap";
        width: 100%;
        align-items: center;
        grid-template-columns: 20% 15% 10% 10% 10% 10% 25%;
        padding-top: 2vh;
        padding-bottom: 2vh;
        border-bottom: 1px solid lightgray;
      }
      
      .grid-header div {
        font-size: 1.1rem;
        font-weight: bold;
      }

      .col-1 {
        margin-left: 10px;
        grid-area: name;
      }

      .col-2 {
        text-align: right;
        grid-area: price;
      }

      
      .col-3 {
        grid-area: 1h;
      }

      .col-4 {
        grid-area: 24h;
      }

      .col-5 {
        grid-area: 7d;
      }

      .col-6 {
        grid-area: 30d;
      }

      .col-7 {
        grid-area: market-cap;
      }

      .card {
        align-items: center;
      }

      a {
        color: black;
        text-decoration: none;
      }

      .name-and-icon img {
        width: 35px
      }

      .coin-name {
        margin-left: 10px;
        font-weight: bold;
        font-size: 0.95rem;
      }

      .current-price {
        font-weight: bold;
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
        fotn-weight: bold
      }
      
      @media screen and (max-width: 799px) {

        .coin-table {
          box-shadow: unset;
        }

        .grid-header {
          display: none;
        }
        
        .card {
          grid-template-areas: 
          "name name"
          "price 1h";
          grid-template-columns: min-content max-content;
          grid-row-gap: 5px;
          border: none;
          box-shadow: 1px 1px 10px 1px #00000014;
        }
        
        .coin-name {
          font-size: 1.1rem;
        }

        .col-2 {
          margin-left: 10px;
        }
        
        .col-2, .col-3 {
          text-align: left;
        }

        .col-3 .price-change {
          font-size: 0.8rem;
        }

        .col-4, .col-5, .col-6, .col-7 {
          display: none;
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
          padding: 1rem 0;
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
