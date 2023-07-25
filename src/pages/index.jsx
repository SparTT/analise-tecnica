import Head from 'next/head'
import { formatCurrency, getCookie, fetcher, prepareMultCrypto } from '@/components/utils/reusable-scripts'
import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/elements/sidebar';
import { getSession } from 'next-auth/react';

export async function getServerSideProps(context) {

  const session = await getSession(context)
  const cookieHeader = context.req.headers.cookie
  
  let vsFiat = getCookie(cookieHeader, 'vsCurrency', 'brl')

  return {
    props: { vsFiat, session }
  }
}

export default function Home({ vsFiat, session }) {

  const [ vsCurrency, setVsCurrency ] = useState(vsFiat)

  // <Header vsCurrency={vsCurrency} setVsCurrency={setVsCurrency} />

  return (
    <>
      <Head>
        <title>Home</title>
      </Head>
      <Sidebar session={session} />
      <div className="min-h-screen flex flex-col justify-center items-center bg-zinc-900 text-slate-200	text-center">
          <div className="p-5">
          <div className='text-3xl font-bold mt-5'>Updating everything</div>
          <div className='text-xs mt-1 mb-6 italic'>yup, i'm manually adding it</div>
          <ul className='font-semibold list-decimal text-left p-4'>
            <li className='font-bold text-emerald-200'> Completely set up crypto Dashboard - IMPORTANT</li>
            <li className='line-through'>Create modal template using Forms</li>
            <li className='line-through'>Add CRUD operations to /Crypto</li>
            <li>Set up vs_currency</li>
            <li>Add cache validation on coingecko req - temp</li>
            <li>Solve that mobile toggle bug on doughnut chart</li>
            <li>Find another cryptocurrency API to use instead of coingecko - probably coinmarketcap</li>
            <li className='line-through'>Use tailwind on /Crypto</li>
            <li className='line-through'>Change auth</li>
            <li className='line-through'>Set up navigation method - sidebar used</li>
            <li>Set up login and sign-up page</li>
            <li className='font-bold text-emerald-300'> Start working on expenses dashboard - IMPORTANT</li>
            <li>Allow a list of recurrent expenses (i.e: toothpaste that costs $2 bought every two months)</li>
            <li>...</li>
            <li>Review this stock API: https://polygon.io/pricing</li>
            <li className='font-bold text-emerald-400'> Start working on stocks dashboard - IMPORTANT</li>

          </ul>
          </div>
      </div>
    </>
    
  )
}
