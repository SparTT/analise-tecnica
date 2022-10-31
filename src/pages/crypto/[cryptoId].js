import { useRouter } from 'next/router'
import styles from '../../stylesheet/pages/cryptos.module.css'
import { useEffect } from 'react'
import React, { useState, } from 'react';
import Header from '../../components/elements/header'
import { formatCurrency, capitalize, fetcher } from '../../components/general-scripts/reusable-scripts'
import Head from 'next/head'
import useSWR from 'swr'


// getServerSideProps
export async function getServerSideProps(context) {
  // Fetch data from external API
  const crypto = context.params.cryptoId
  //const vs = context.query.vs // &vs=${vs}
  //const data = await fetch(`/api/crypto/get-crypto?id=${crypto}`).then(resp => resp.json())
  // ,{secure: true,    rejectUnauthorized: false}


  let vsFiat = context.req.headers.cookie

  // change this logic later
  if (typeof vsFiat === 'undefined') vsFiat = ''

  if (vsFiat.search('vsCurrency') > -1) {
    vsFiat = vsFiat.split('vsCurrency=')[1]
    vsFiat = vsFiat.split(';')[0]
    //console.log('vsFiat', vsFiat)
  } else {
    //console.log('cookie não encontrado')
    vsFiat = 'brl'
  }

  // Pass data to the page via props
  return { props: { vsFiat } }
}

const CalculateQtd = ({ cryptoPrice, cryptoName, fiatPreference }) => {


  // decidir se calculo ficará aqui ou client-side

  const[ lastChangedVal, setLastChangedVal ] = useState(null);


  console.log(cryptoPrice)

  useEffect(() => {

    if(lastChangedVal === 'crypto') {
      convertCrypto()
    } else {
      convertFiat()
    }

  })


  function convertCrypto() {

    setLastChangedVal('crypto')

    const fiat = Number(document.querySelector('#fiat-input').value)
    const res = fiat / cryptoPrice

    document.querySelector('#crypto-input').value = res

  }

  function convertFiat() {

    setLastChangedVal('fiat')

    const crypto = Number(document.querySelector('#crypto-input').value)
    const res = crypto * cryptoPrice

    document.querySelector('#fiat-input').value = res

  }


  return(
    <>
    <div className="calculate-container">
      <div className='input-container'>
        <span className="input-group-text">{cryptoName.toUpperCase()}</span>
        <input className="calculate-input" type="number" id="crypto-input" min="" defaultValue={1} onChange={() => convertFiat()} />
      </div>
      <div className='input-container'>
        <span className="input-group-text">{fiatPreference.toUpperCase()}</span>
        <input className="calculate-input" type="number" name="fiat-input" id="fiat-input" defaultValue={cryptoPrice} onChange={() => convertCrypto()} />
      </div>
    </div>
    <style jsx>{`
      .calculate-container {
        padding: 15px;
        display: flex;
        /*flex-wrap: wrap;*/
        gap: 15px;
        margin-top: 2em;
        margin-bottom: 2em;
        margin-left: auto;
        margin-right: auto;
        background-color: aliceblue;
        border: 3px solid #dbe9f5;
        border-radius: 0.375rem;
        padding-top: 30px;
        padding-bottom: 30px;
        max-width: 600px;
        justify-content: center;
      }

      .input-container {
        width: auto;
        font-weight: bold;
      }

      .input-container, .calculate-input {
        font-size: 1.2rem;
      }

      .calculate-input {
        width: 50%;
      }

      @media screen and (min-width: 629px) {
        .input-container:nth-child(1) {text-align: right;}
        .input-container:nth-child(2) {text-align: left;}
      }

      @media screen and (max-width: 629px) {
        .input-container {text-align: center;}
      }


      .input-group-text {
        margin-right: 5px;
      }

    `}</style>
    </>
  )
}


function Price({ cryptoName, vsCurrency }) {
  
  function getData(id) {
    let url = `https://api.coingecko.com/api/v3/coins/${id}`
    const { data } = useSWR(url, fetcher, { refreshInterval: 10000 })
    return data
  }


  let data = getData(cryptoName, vsCurrency)
  console.log(cryptoName, vsCurrency)
  
  if(!data) return <div>Carregando</div>

  console.log('data', data)

  if(typeof data.image.small === 'undefined') console.log(data)

  return (
    <>
        <div className={styles['crypto-main-data']}>
          <div className={'name-and-icon'}>
            <img src={data.image.small} />
            <div className={styles['crypto-title']}>{data.name} ({data.symbol.toUpperCase()}) </div>
          </div>
          <div className={styles['price-container']}>
            <span className={styles.price}>{formatCurrency(data.market_data.current_price[vsCurrency], vsCurrency)}</span> 
            <span className={`${['price-change']} ${data.market_data.price_change_percentage_24h_in_currency[vsCurrency]< 0 ? ['price-down'] : ['price-up']}`}>
              {data.market_data.price_change_percentage_24h_in_currency[vsCurrency].toFixed(2)}%  ({formatCurrency(data.market_data.price_change_24h_in_currency[vsCurrency], vsCurrency)}) 
            </span>
          </div>
          <div className={styles['market-cap']}> 
            <span>Market cap: <span id={styles['market-cap-val']}>{formatCurrency(data.market_data.market_cap[vsCurrency], vsCurrency)}</span> </span>
            <span className={`${'price-change'} ${data.market_data.market_cap_change_percentage_24h < 0 ? ['price-down'] : ['price-up']}`}>
              {data.market_data.market_cap_change_percentage_24h.toFixed(2)}%
            </span>
          </div>
        </div>

        <CalculateQtd  cryptoPrice={data.market_data.current_price[vsCurrency]} cryptoName={data.symbol} fiatPreference={vsCurrency} />
    </>
  )

}


const Crypto = ({ vsFiat }) => {

  const mainRouter = useRouter()

  const { cryptoId } = mainRouter.query
  const [ vsCurrency, setVsCurrency ] = useState(vsFiat)

  console.log(cryptoId, vsCurrency)

  return (
    <>
      <Head>
        <title>{capitalize(cryptoId)} price</title>
      </Head>
      <Header vsCurrency={vsCurrency} setVsCurrency={setVsCurrency} />
      <div className={styles.container}> 
        <Price cryptoName={cryptoId} vsCurrency={vsCurrency}/>
      </div>
    </>
  )

}

export default Crypto