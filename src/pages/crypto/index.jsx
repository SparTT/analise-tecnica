import { useSession, getSession, signIn } from "next-auth/react"
import Head from 'next/head'
import React, { useState, useEffect } from 'react';
import { getCookie, fetcher, prepareMultCrypto, formatCurrency, Loading } from '../../components/utils/reusable-scripts'
import { LineChart } from "../../components/crypto/daily-chart"
import Donut from "../../components/crypto/doughnut-chart";
import Sidebar from "@/components/elements/sidebar";
import Modal from "@/components/elements/crypto-modal";
import Link from "next/link";

/*
export async function getServerSideProps(context) {
  
  const session = await getSession(context)
  const cookieHeader = context.req.headers.cookie

  let vsFiat = getCookie(cookieHeader, 'vsCurrency', 'brl')

  return {
    props: { session, vsFiat }
  }

}
*/

// https://cryptotemplate.webflow.io/
// https://themeforest.net/item/kripton-crypto-wallet-ios-app-psd-template/screenshots/27700130?index=1


// https://stackoverflow.com/questions/49634340/echarts-js-format-time-int-to-hms-within-tooltip
// shimmering effect to add --> https://stackoverflow.com/questions/68216941/make-css-shimmer-effect-work-an-already-loaded-image
// format fiat amount to money 


const CryptoTable = ({ data, vsCurrency, setShowModal, setModalValues, session, fullUpdate, hasError }) => {

  if (hasError?.error) return (
    <>
      <div className="text-3xl">Erro (provavelmente na API da coingecko)</div>
      <div className="text-xl">{hasError.error}</div>
      <div className="text-xl">{hasError.errMsg.toString()}</div>
      <div className="text-sm">{hasError.url}</div>
    </> 
  )

  if(!data) return <Loading />

  function openModal(crypto) {
    setModalValues(crypto)
    setShowModal(true)
  }

  async function deleteValue(coin) {

    let willDelete = confirm(`Are you sure you want to delete values from ${coin.id}?`)

    if (!willDelete) return

    let data = {
      name: coin.id,
      userId: session.accessToken.id
    }

    let res = await fetch('api/user/crypto', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    })
    .then(resp => resp.json())
    .then(resp => {
      if (resp.error) return alert(resp.error)
      fullUpdate(resp)

      return resp
    })
    
    return res


  }


  return (
    <>
    
    <div className="overflow-scroll max-h-[375px] lg:overflow-auto">
    <table className="w-full">
      <thead>
        <tr className="font-bold text-lg text-left border-b border-zinc-700">
          <th className="pl-2">Name</th>
          <th className="px-2">Qtd</th>
          <th className="px-2">24h</th>
          <th className="px-2">Cost</th>
          <th className="px-2">Price</th>
          <th className="px-2">Total</th>
          <th className="px-2"></th>
          <th className="px-2"></th>
        </tr>
      </thead>
      <tbody>
        { data.map( coin => (
          <tr key={coin.name} className="border-b border-zinc-800 py-3 font-bold">
            <td className="pl-2">
              <span>
                <Link href={`/crypto/coin/${coin.id}`}>
                  {coin.name}
                </Link>
              </span>
            </td>
            <td className="px-2">
              <span>
                {coin.user_crypto_qtd} 
              </span>
            </td>
            <td className="px-2">
              <span className={`font-bold ${coin.price_change_percentage_24h_in_currency < 0 ? 'text-rose-600' : 'text-green-600'}`}>
                {coin.price_change_percentage_24h_in_currency}%
              </span>
            </td>
            <td className="px-2">
              <span className="amount-spent">
                {formatCurrency(coin.user_spent_amount, 'brl')}
              </span>
            </td>
            <td className="px-2">
              <span className={`font-bold`}>
                {formatCurrency(coin.current_price, vsCurrency)} 
              </span>
            </td>
            <td className="px-2">
              <span className='total-amount'>
                { formatCurrency(coin.user_fiat_amount, vsCurrency) } 
              </span>
            </td>
            <td className="px-2">
              <button className='w-[35px] bg-transparent p-[5px]' onClick={() => openModal(coin)}>
              <i className="bi bi-pencil-square text-lg"></i>
              </button>
          </td>
          <td className="px-2">
              <button className='p-[1px] px-[5px] bg-rose-600 rounded-md text-center' onClick={() => deleteValue(coin)}>
                <i className="bi bi-trash"></i>
              </button>
          </td>
          </tr>
        ))}
      </tbody>
    </table>
    </div>
    </>
  )
}


const HideBtn = () => <button className="bg-zinc-800 px-3 py-1 rounded-md"><i className={`bi bi-eye text-xl`}></i></button>
 

const ContentSkeleton = ({ session, vsCurrency, isLoading, data, setShowModal, setModalValues, fullUpdate, hasError  }) => {

  // texto de carregando até add shimmer

  function openAdd() {
    setShowModal(true)
    setModalValues(null)
  }

  //console.log(session)

  let start = session ? `Hi, ${session.user.name.first}` : 'Hi!'
  return (
    <>
      <main className="min-h-screen flex flex-col justify-center items-center px-6 gap-y-3 lg:ml-[250px]">
        <div className="text-center flex items-center my-4 mt-[10vh] lg:text-left lg:mt-4 w-full">
          <h1 className="text-3xl	font-bold my-2 pl-2"> {start} </h1>
          <div className="mx-4">
            <HideBtn />
          </div>
          <div>
            <button className="bg-zinc-800 px-3 py-1 rounded-md" onClick={() => openAdd()}>
              <i className="bi bi-plus-circle text-lg mr-2"></i>
              Add Crypto
            </button>
          </div>
        </div>
        <div className="w-full flex flex-col justify-between gap-6 lg:flex-row">
          <div className="p-5 box-border rounded-lg bg-zinc-900 w-full flex flex-col justify-center lg:w-3/4 lg:p-8 min-h-[416px] max-h-[416px]">
            <h2 className="text-2xl font-bold mb-5 text-center">{isLoading ? '' : `Total value: ${formatCurrency(data.user_total_amount, vsCurrency)}`}</h2>
            <CryptoTable 
              data={isLoading ? null : data.cryptos} 
              vsCurrency={vsCurrency}
              setShowModal={setShowModal}
              setModalValues={setModalValues}
              session={session}
              fullUpdate={fullUpdate}
              hasError={hasError}
            />
          </div>
          <div className="p-5 box-border rounded-lg bg-zinc-900 w-full overflow-scroll flex flex-col justify-center lg:w-1/4 lg:p-8 lg:overflow-visible min-h-[416px] max-h-[416px]">
            <h2 className="text-2xl font-bold mb-5 text-center">Your portfolio</h2>
            <div className="min-w-[250px] lg:min-w-0">
              <Donut data={isLoading ? null : data.cryptos} hasError={hasError} />
            </div>
          </div>
        </div>
        <div className="flex-col items-center gap-3 row my-5 w-full">
          <div className="p-5 box-border rounded-lg bg-zinc-900 w-full min-h-[415px] text-center lg:p-8">
            <h2 className="text-2xl font-bold mb-5">Daily Value</h2>
              {isLoading && !hasError ? 'Loading' : <LineChart vsCurrency={vsCurrency} /> }
          </div>
        </div>
      </main>
    </>
  )
}


export default function CryptoDashboard () {

  


  const { data: session, status } = useSession()

  
  //let vsFiat = getCookie(cookieHeader, 'vsCurrency', 'brl')

  const [ vsCurrency, setVsCurrency ] = useState('brl')


  const [ userData, setUserData ] = useState(null);
  const [ cryptoData, setCryptoData ] = useState(null);
  const [ cryptoStr, setCryptoStr ] = useState(null)
  const [showModal, setShowModal] = useState(false);
  const [modalValues, setModalValues] = useState(null)

  // use cryptoData and vsCurrency through useContext/getContext
  // show modal through useContext
  //console.log(session)

  async function getCryptoData(vs_currency, cryptoId) {

    let url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${vs_currency}&ids=${cryptoId}&order=market_cap_desc&per_page=100`
    url += `&page=1&sparkline=false&price_change_percentage=1h,24h,7d,30d,1y`
    try {
      
      let res = await fetch(url, {
        headers: {
          'content-type': 'application/json',
          'cache-control': 'public, s-maxage=1200, stale-while-revalidate=600',
        },
      })
      .then(resp => resp.json()).catch(e => {
        return {error: 'deu ruim' , errMsg: e, url: url}
      })
      
      setCryptoData(res)

    } catch(e) {
      return {error: 'deu ruim' , errMsg: e}
    }
  }

  if (status === 'loading') {
    return (
      <>
        <Head>
          <title>Loading</title>
        </Head>
        <Sidebar session={session} />
        <ContentSkeleton session={session} vsCurrency={vsCurrency} isLoading={true} />
      </>
    )
  }


  if (!session) {
    signIn()
    return (
      <>
        <Head>
          <title>Loading</title>
        </Head>
        <Sidebar session={session} />
        <ContentSkeleton session={session} vsCurrency={vsCurrency} isLoading={true} />
      </>
    )
  }


  async function getUserData() {
              
    let userVal = await fetch('/api/user/get-user')
      .then(resp => resp.json())
      .then(async resp => {
        if (resp === null) {
          //console.log('erro ao carregar os dados')
          return null
        } else {
          //console.log('had sess req')
          return resp
        }
      })
      setUserData(userVal)
      setCryptoStr(Object.keys(userVal).toString())
      getCryptoData(vsCurrency, Object.keys(userVal).toString())
  }
  if(!cryptoData?.error) getUserData()

  if (!cryptoStr || !userData || !cryptoData) return (
    <>
      <Head>
        <title>Loading</title>
      </Head>
      <Sidebar session={session} />
      <ContentSkeleton session={session} vsCurrency={vsCurrency} isLoading={true} />
    </>
  )

  if (cryptoData?.error) return (
    <>
    <title>Error :(</title>
    <Sidebar session={session} />
    <ContentSkeleton session={session} vsCurrency={vsCurrency} isLoading={true} hasError={cryptoData} />
  </>
  )


  let data = cryptoData
   
  data = prepareMultCrypto(data)
  
  // faz merge dos dados
  let account_total = 0

  //console.log(data)

  for (let el of data) {
    for (let i = 0; i < Object.values(userData).length; i++) {
      
      let name = Object.keys(userData)[i]
      let val = Object.values(userData)[i]
      
      if (el.id === name) {

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

  //return <ContentSkeleton session={session} vsCurrency={vsCurrency} data={res} />
  
  function fullUpdate(resp) {
    setUserData(resp)
    setCryptoStr(Object.keys(resp).toString())
    getCryptoData(vsCurrency, Object.keys(resp).toString())
    setShowModal(false)
  }


  return (
    <>
      <Head>
        <title>Crypto Dashboard</title>
      </Head>
      <Modal 
        showModal={showModal} setShowModal={setShowModal} 
        isAdd={true} userId={session.accessToken.id} 
        modalValues={modalValues} updateData={fullUpdate}
      />
      <Sidebar session={session} />
      <ContentSkeleton 
        session={session} vsCurrency={vsCurrency} data={res} 
        userId={session.accessToken.id}
        setShowModal={setShowModal} setModalValues={setModalValues}
        fullUpdate={fullUpdate}
      />
    </>
    
  )
}