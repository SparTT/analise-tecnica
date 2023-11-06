import { useRouter } from 'next/router'
import styles from '@/stylesheet/pages/cryptos.module.css'
import { useEffect } from 'react'
import React, { useState, } from 'react';
import Header from '@/components/elements/header'
import { formatCurrency, capitalize, fetcher } from '@/components/utils/reusable-scripts'
import Head from 'next/head'
import useSWR from 'swr'
import Sidebar from '@/components/elements/sidebar';
import { useSession } from 'next-auth/react';



const CalculateQtd = ({ cryptoPrice, cryptoName, fiatPreference }) => {


  // decidir se calculo ficará aqui ou client-side

  const[ lastChangedVal, setLastChangedVal ] = useState(null);


  console.log(cryptoPrice)

  useEffect(() => {
    lastChangedVal === 'crypto' ? convertCrypto() : convertFiat()
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
    <div className="flex flex-col justify-center bg-zinc-900 w-[90%] lg:w-[600px] py-4 gap-[15px] rounded min-h-[150px] font-bold text-lg">
      <div className='px-4 flex justify-center gap-[10px]'>
        <span className="py-1">{cryptoName.toUpperCase()}</span>
        <input className="rounded text-black pl-1" type="number" id="crypto-input" min="" defaultValue={1} onChange={() => convertFiat()} />
      </div>
      <div className='px-4 flex justify-center gap-[10px]'>
        <span className="py-1">{fiatPreference.toUpperCase()}</span>
        <input className="rounded text-black pl-1" type="number" name="fiat-input" id="fiat-input" defaultValue={cryptoPrice} onChange={() => convertCrypto()} />
      </div>
    </div>
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


const Crypto = () => {

  const mainRouter = useRouter()

  const { cryptoId } = mainRouter.query
  const [ vsCurrency, setVsCurrency ] = useState('brl')

  console.log(cryptoId, vsCurrency)

  const { data: session, status } = useSession()

  return (
    <>
      <Head>
        <title>{cryptoId} price</title>
      </Head>
      <Sidebar session={session} />
      <main className="min-h-screen flex flex-col pt-[10vh] items-center px-6 gap-y-3 lg:ml-[250px]">
        <Price cryptoName={cryptoId} vsCurrency={vsCurrency}/>
      </main>
    </>
  )

}

export default Crypto