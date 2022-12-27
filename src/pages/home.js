import { useSession, getSession, signIn } from "next-auth/react"
import Head from 'next/head'
import Header from "../components/elements/header"
import React, { useState, useEffect } from 'react';
import useSWR from 'swr'

import { getCookie, fetcher, prepareMultCrypto, formatCurrency } from '../components/general-scripts/reusable-scripts'
import { LineChart } from "../components/crypto/daily-chart"
import Donut from "../components/crypto/doughnut-chart";

import styles from '../stylesheet/components/table.module.css'


export async function getServerSideProps(context) {
  
  const session = await getSession(context)
  const cookieHeader = context.req.headers.cookie

  let vsFiat = getCookie(cookieHeader, 'vsCurrency', 'brl')

  return {
    props: { session, vsFiat }
  }

}

// https://cryptotemplate.webflow.io/
// https://themeforest.net/item/kripton-crypto-wallet-ios-app-psd-template/screenshots/27700130?index=1


// https://stackoverflow.com/questions/49634340/echarts-js-format-time-int-to-hms-within-tooltip
// shimmering effect to add --> https://stackoverflow.com/questions/68216941/make-css-shimmer-effect-work-an-already-loaded-image
// format fiat amount to money 

// no mobile, chart terá scroll horizontal
// arquivo main.css será temp

const CryptoTable = ({ data, vsCurrency }) => {

  if(!data) return <div> carregando </div>

  // amount spent: // { isvisible === true ? formatCurrency(coin.user_spent_amount, 'brl') : notVisible} 

  // total amount: // { isvisible === true ? formatCurrency(coin.user_crypto_amount, vsCurrency): notVisible } 


  // edit btn

  /* 
    <td>
      <button className='edit-btn' onClick={() => openModal('edit', setIsAdd, userData[coin.id], coin.id)}>
        <img src="/icons/pencil-alt.svg" />
      </button>
    </td>
  
  */

  return (
    <>
    <table>
      <thead>
        <tr>
          <td>Name</td>
          <td>Qtd</td>
          <td>24h</td>
          <td>Cost</td>
          <td>Price</td>
          <td>Total</td>
          <td></td>
        </tr>
      </thead>
      <tbody>
        { data.map( coin => (
          <tr key={coin.name}>
            <td>
              {coin.name}
            </td>
            <td>
              {coin.user_crypto_qtd} 
            </td>
            <td>
              <span className={`${['price-change']} ${coin.price_change_percentage_24h_in_currency < 0 ? ['price-down'] : ['price-up']}`}>
                {coin.price_change_percentage_24h_in_currency}%
              </span>
            </td>
            <td>
              <span className="amount-spent">
                {formatCurrency(coin.user_spent_amount, 'brl')}
              </span>
            </td>
            <td>
              <span className={`${styles['current-price']} ${['current-price']}`}>
                {formatCurrency(coin.current_price, vsCurrency)} 
              </span>
            </td>
            <td>
              <span className='total-amount'>
                { formatCurrency(coin.user_fiat_amount, vsCurrency) } 
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
    <style jsx>{`

      table {
        width: 100%;
      }

      table thead td {
        font-size: 1.1rem;
        font-weight: bold;
      }
    
    `}
    </style>
    
    
    </>
  )
}


const ContentSkeleton = ({ session, vsCurrency, isLoading, data }) => {

  // texto de carregando até add shimmer

  return (
    <>
      <div className="container">
        <div className="first-content">
          <h1>Hi, {session.user.name.first}</h1>
        </div>
        <div className="row">
          <div className="crypto-table-container">
            <h2>Total value: {isLoading === true ? 'carregando' : formatCurrency(data.user_total_amount, vsCurrency)}</h2>
            <CryptoTable data={isLoading === true ? null : data.cryptos} vsCurrency={vsCurrency} />
          </div>
          <div className="donut-chart-container">
            <Donut data={isLoading === true ? null : data.cryptos} />
          </div>
        </div>
        <div className="row mx-5">
          <div className="daily-val-container">
            <LineChart vsCurrency={vsCurrency} />
          </div>
        </div>
      </div>
      <style jsx>{`

          .first-content {
            text-align: left;
          }
          
          .row {
            width: 100%;
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            gap: 2vw;
          }

          .mx-5 {
            margin-top: 5vh;
            margin-bottom: 5vh;
          }

          @media screen and (max-width: 800px) {
            .row {
              flex-direction: column;
              gap: 5vh;
              width: 100%;
              align-items: center;
            }

            .crypto-table-container h2 {
              text-align: center;
            }
            
            .first-content {
              text-align: center;
            }
          }
        `}
      </style>
    </>
  )
}

const Main = ({ session, vsCurrency }) => {


  const [ userData, setUserData ] = useState(null);
  //const [ isAdd, setIsAdd ] = useState(false);
  const [ clientWidth, setClientWidth ] = useState(null);
  //const [ isvisible, setisVisible ] = useState(isVisible)
  const [ cryptoStr, setCryptoStr ] = useState(userData !== null ? Object.keys(userData).toString() : null)

  function getData(cryptoId, vs_currency) {
    
    let url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${vs_currency}&ids=${cryptoId}&order=market_cap_desc&per_page=100`
    url += `&page=1&sparkline=false&price_change_percentage=1h,24h,7d,30d,1y`

    const { data } = useSWR(url, fetcher, { refreshInterval: 10000 })
    return data
  }


  useEffect( () => {
    if (session) {
      window.addEventListener('resize', () => {
        let type = document.body.clientWidth > 799 ? 'desktop' : 'mobile'
        if (type !== clientWidth) setClientWidth(type)
      }) 
      
      document.body.clientWidth > 799 ? setClientWidth('desktop') : setClientWidth('mobile')

      async function fetchUserData() {
              
        let userVal = await fetch('/api/user/get-user')
          .then(resp => resp.json())
          .then(async resp => {
            if (resp === null) {
              console.log('erro ao carregar os dados')
              return null
            } else {
              console.log('had sess req')
              return resp
            }
          })
          setUserData(userVal)
          setCryptoStr(Object.keys(userVal).toString())
      }
      fetchUserData()


      console.time('get-data')
    } else {
      signIn()
    }
    
  }, [])


  
  let data = getData(cryptoStr, vsCurrency)

  // testar sem || typeof data === 'undefined'  em prod

  if (cryptoStr === null || !data) return <ContentSkeleton session={session} vsCurrency={vsCurrency} isLoading={true} />

  // pensar nisso dps
  /*
  if (Object.keys(data).includes('status')) {
    console.log('status err', data.status)
    if (data.status.error_code === 429) return <div className="container">Matou a API :(</div>
  }
  */
  
  data = prepareMultCrypto(data)
  
  // faz merge dos dados
  let account_total = 0

  for(let el of data) {
    for(let i = 0; i < Object.values(userData).length; i++) {
      
      let name = Object.keys(userData)[i]
      let val = Object.values(userData)[i]
      
      if(el.id === name) {

        el.user_crypto_qtd = val.qtd
        el.user_spent_amount = val.total_spent
        el.user_fiat_spent = val.currency_spent
        el.user_fiat_amount = el.current_price * val.qtd

        account_total += el.user_fiat_amount

      }

    }
  }

  let res = {
    cryptos: data,
    user_total_amount: account_total
  }

  console.log(res)

  return <ContentSkeleton session={session} vsCurrency={vsCurrency} data={res} />

} 



export default function Home ({ vsFiat, session }) {

  const [ vsCurrency, setVsCurrency ] = useState(vsFiat)

  return (
    <>
      <Head>
        <title>Home</title>
      </Head>
      <Header vsCurrency={vsCurrency} setVsCurrency={setVsCurrency} />
      <Main session={session} vsCurrency={vsCurrency} />
      <link rel="stylesheet" href="/main.css"></link>
    </>
    
  )
}