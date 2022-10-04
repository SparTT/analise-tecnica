import { useSession, getSession, signIn } from "next-auth/react"
import Head from 'next/head'
import useSWR from 'swr'
import { formatCurrency, getCurrentFiat, fetcher } from '../components/general-scripts/reusable-scripts'
import React, { useState, useEffect } from 'react';
import styles from '../stylesheet/components/table.module.css'

function getData(cryptoId, vs_currency) {
  const { data } = useSWR(`/api/crypto/get-many-crypto?id=${cryptoId}&fiat=${vs_currency}`, fetcher, { refreshInterval: (1000 * 15) })
  return data
}

function Main({ vsCurrency, setVsCurrency }) {

  const cryptoIds = 'bitcoin,ethereum,monero,smooth-love-potion,polygon,binancecoin,usd-coin,solana,polkadot,dogecoin,litecoin,gala,cardano,magic-internet-money'

  useEffect(() => initializer(), [])

  let vsFiat
  const initializer = async () => {
    vsFiat = getCurrentFiat()
    setVsCurrency(vsFiat)
    console.log('vsC', vsCurrency, vsFiat)
  }

  const data = getData(cryptoIds, vsCurrency)

  if(!data) return <div>Carregando</div>

  console.log('data loaded', new Date())
  console.log(data)

  return (
    <main className={styles.main}>
    <h1 className={styles.title}>
      Main Cryptos
    </h1>

    <span className={styles.description}>
      um textinho de descrição
    </span>

    <div className={styles.table}>
      <div className={`${styles['table-head']} ${'table-head'}`}>
        <div className='col-1'>Nome</div>
        <div className='col-2'>Preço</div>
        <div className='col-3 text-center'>1h</div>
        <div className='col-4 text-center'>24h</div>
        <div className='col-5 text-center'>7d</div>
        <div className='col-6 text-center'>30d</div>
        <div className='col-7 text-center'>Market Cap</div>
      </div>
      <div className={styles['table-body']}>
        {data.map( coin => (
          <div className={`${styles['card']} ${'card'}`} key={coin.id}>
            <div className='col-1'>
              <div className={`${styles['name-and-icon']} ${'name-and-icon'}`}>
                <img src={`${coin.image.replace('/large/', '/small/')}`} draggable='false' className={styles['crypto-icon']}></img>
                <a href={`/crypto/${coin.id}`} className={styles['link-crypto']}><span className={styles['coin-name']}>{coin.name}</span></a>
              </div>
            </div>
            <div className='col-2'>
              <span className={styles['current-price']}>
                {formatCurrency(coin.current_price, vsCurrency)} 
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
              <span>{formatCurrency(coin.market_cap, vsCurrency)}</span>
            </div>  
          </div>
        ))}
      </div>
    </div>

    <style jsx>{`

      .table-head, .card {
        grid-template-areas:
            "name price 1h 24h 7d 30d market-cap";
        width: 100%;
        grid-template-columns: 20% 15% 10% 10% 10% 10% 25%;
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

      @media screen and (max-width: 799px) {

        .table-head {
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


export default function Home({ setCryptoStr, vsCurrency, setVsCurrency}) {
  return (
    <>
      <Head>
        <title>Home</title>
      </Head>
      <div className="container">
        <Main setCryptoStr={setCryptoStr} vsCurrency={vsCurrency} setVsCurrency={setVsCurrency}  />
      </div>
    </>
    
  )
}
