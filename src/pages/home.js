import { useSession, getSession, signIn } from "next-auth/react"
import Head from 'next/head'
import Header from "../components/elements/header"
import useSWR from 'swr'
import { formatCurrency, getCurrentFiat, fetcher, prepareMultCrypto } from '../components/general-scripts/reusable-scripts'
import React, { useState, useEffect } from 'react';
import styles from '../stylesheet/components/table.module.css'
import desktopTable from "../components/elements/desktop-table"


export default function Home({ vsFiat }) {

  const [ vsCurrency, setVsCurrency ] = useState(vsFiat)

  return (
    <>
      <Head>
        <title>Home</title>
      </Head>
      <Header vsCurrency={vsCurrency} setVsCurrency={setVsCurrency} />
      <div className="container">
        <desktopTable />
      </div>
    </>
    
  )
}