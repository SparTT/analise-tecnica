import { useSession, getSession, signIn } from "next-auth/react"
import Header from "../components/elements/header"
import React, { useState, useEffect } from 'react';
import styles from '../stylesheet/components/table.module.css'
import { formatCurrency, getCurrentFiat, fetcher, prepareMultCrypto } from '../components/general-scripts/reusable-scripts'
import Head from 'next/head'
import Modal from '../components/elements/modal'
import useSWR from 'swr'

let notVisible = '*****'

const DesktopView = ({ marketData, setIsAdd, userData, isvisible, vsCurrency }) => {
  return (
    <>
     <div className={styles.table}>
        <div className={`${styles['table-head']} ${'table-head'}`}>
          <div className='col-1'>Nome</div>
          <div className='col-2'>Qtd</div>
          <div className='col-3'>24h</div>
          <div className='col-4'>Custo</div>
          <div className='col-5'>Preço</div>
          <div className='col-6'>Total</div>
          <div className='col-7'></div>
        </div>
              <div className={styles['table-body']}>
                {marketData.map( coin => (
                  <div className={`${styles['card']} ${'card'}`} key={coin.id}>
                    <div className='col-1'>
                      <div className={`${'name-and-icon'}`}>
                        <img src={`${coin.image.replace('/large/', '/small/')}`} draggable='false' className={styles['crypto-icon']}></img>
                        <a href={`/crypto/${coin.id}`} className={styles['link-crypto']}><span className={styles['coin-name']}>{coin.name}</span></a>
                      </div>
                    </div>
                    <div className='col-2'>
                      <span className="user-qtd">
                        {coin.user_crypto_qtd} 
                      </span>
                    </div>
                    <div className='col-3'>
                      <span className={`${['price-change']} ${coin.price_change_percentage_24h_in_currency < 0 ? ['price-down'] : ['price-up']}`}>
                        {coin.price_change_percentage_24h_in_currency}%
                      </span>
                    </div>  
                    <div className='col-4'>
                      <span className="amount-spent">
                        { isvisible === true ? formatCurrency(coin.user_spent_amount, 'brl') : notVisible} 
                      </span>
                    </div>
                    <div className='col-5'>
                      <span className={`${styles['current-price']} ${['current-price']}`}>
                        {formatCurrency(coin.current_price, vsCurrency)} 
                      </span>
                    </div>  
                    <div className='col-6'>
                      <span className='total-amount'>
                        { isvisible === true ? formatCurrency(coin.user_crypto_amount, vsCurrency): notVisible } 
                      </span>
                    </div>
                    <div className='col-7'>
                      <button className='edit-btn' onClick={() => openModal('edit', setIsAdd, userData[coin.id], coin.id)}>
                        <img src="/icons/pencil-alt.svg" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <style jsx>{`

              .table-head, .card {
                grid-template-areas:
                    "name qtd 24h cost price total edit";
                width: 100%;
                grid-template-columns: 25% 6% 15% 15% 17% 17% 2%;
              }

              .col-1 {
                grid-area: name;
                margin-left: 10px;
              }

              .col-2, .col-3, .col-4, .col-5, .col-6 {
                text-align: right;
              }

              .col-2 {
                text-align: right;
                grid-area: qtd;
              }

              .col-3 {
                grid-area: 24h;
              }

              .col-4 {
                grid-area: cost;
              }

              .col-5 {
                grid-area: price;
              }

              .col-6 {
                grid-area: total;
                text-align: center;
              }

              .col-7 {
                grid-area: edit;
              }

              /* --- */

              #add-crypto-btn {
                background: #3f51b5;
                color: white;
                border: 1px solid transparent;
                border-radius: 0.375rem;
              }

              .total-amount, .amount-spent, .user-qtd {
                font-weight: bold;
              }

              .amount-spent, .current-price {
                color: #626262;
              }

              .edit-btn {
                background: unset;
                border: unset;
                cursor: pointer;
              }

              .edit-btn img {
                width: 20px;
              }

              .btn-container {
                padding-top: 2ch;
                padding-bottom: 2ch;
              }

              .btn-container button {
                  padding: 1ch;
                  font-size: 1rem;
                  cursor: pointer;
              }

              `}</style>
    </>
  )
}


const MobileView = ({ marketData, setIsAdd, userData, isvisible, vsCurrency }) => {

  // icon/nome, price/change_24_hrs,  qtd (crypto)/qtd (em fiat)
  return (
    <>
     <div className={styles.table}>
        <div className={`${styles['table-head']} ${'table-head'}`}>
          <div className='col-1'>Nome</div>
          <div className='col-2'>Price</div>
          <div className='col-3'>Qtd</div>
          <div className='col-4'></div>
        </div>
              <div className={styles['table-body']}>
                {marketData.map( coin => (
                  <div className={`${styles['card']} ${'card'}`} key={coin.id}>
                    <div className='col-1'>
                      <div className={`${'name-and-icon'}`}>
                        <img src={`${coin.image.replace('/large/', '/small/')}`} draggable='false' className={styles['crypto-icon']}></img>
                        <a href={`/crypto/${coin.id}`} className={styles['link-crypto']}><span className={styles['coin-name']}>{coin.name}</span></a>
                      </div>
                    </div>
                    <div className='col-2'>
                      <span className={`${styles['current-price']} ${['current-price']}`}>
                        {formatCurrency(coin.current_price, vsCurrency)} 
                      </span>
                      <span className={`${['price-change']} ${coin.price_change_percentage_24h_in_currency < 0 ? ['price-down'] : ['price-up']}`}>
                        {coin.price_change_percentage_24h_in_currency}%
                      </span>
                    </div>
                    <div className='col-3'>
                      <span className='total-amount'>
                        {isvisible === true ? formatCurrency(coin.user_crypto_amount, vsCurrency) : notVisible} 
                      </span>
                      <span className="user-qtd">
                        {coin.user_crypto_qtd} {coin.symbol.toUpperCase()}
                      </span>
                    </div>  
                    <div className='col-4'>
                      <button className='edit-btn' onClick={() => openModal('edit', setIsAdd, userData[coin.id], coin.id)}>
                        <img src="/icons/pencil-alt.svg" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <style jsx>{`
            
              .table-head, .card {
                grid-template-areas:
                    "name price qtd edit";
                width: 100%;
                grid-template-columns: 30% 30% 30% 10%;
              }  

              .card, .name-and-icon span {
                font-size: 0.85rem;
              }

              .col-1 {
                grid-area: name;
                margin-left: 5px;
              }

              .col-2 {
                text-align: right;
                grid-area: price;
              }

              .col-3 {
                grid-area: qtd;
                text-align: right;
                font-weight: bold;
              }

              .col-4 {
                grid-area: edit;
              }

              .card .col-2, .card .col-3 {
                display: grid;
              }

              .name-and-icon img {
                width: 17px;
              }

              .edit-btn {
                background: unset;
                border: unset;
                cursor: pointer;
              }

              .edit-btn img {
                width: 17px;
              }

              .card {
                box-shadow: unset;
              }


            `}</style>
    </>
  )  
}


export async function getServerSideProps(context) {
  const session = await getSession(context)

  // change all of this later

  let isVisibleCookie = context.req.headers.cookie

  // change this logic later
  if (typeof isVisibleCookie === 'undefined') isVisibleCookie = 'isVisible=true'

  if (isVisibleCookie.search('isVisible') > -1) {
    isVisibleCookie = isVisibleCookie.split('isVisible=')[1]
    isVisibleCookie = isVisibleCookie.split(';')[0]
    console.log('isVisibleCookie', isVisibleCookie)
    isVisibleCookie = isVisibleCookie === 'false' ? false : true
  } else {
    console.log('isVisibleCookie não encontrado')
    isVisibleCookie = true
  }


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

  return {
    props: { session, isVisibleCookie, vsFiat }
  }

  // https://blog.logrocket.com/handling-data-fetching-next-js-useswr/ -- find mutate later to apply on updates realized
  // reset git branch 
  // abstract cookies to one function
  // https://medium.com/javascript-dots/cache-api-in-javascript-644380391681

  // https://tinloof.com/blog/using-next.js-and-vercel-to-instantly-load-a-data-heavy-website
}

const Content = ({ session, isVisibleCookie, vsCurrency}) => {

  //console.log(session.accessToken.userData)

  const [ userData, setUserData ] = useState(null);
  const [ isAdd, setIsAdd ] = useState(false);
  const [ clientWidth, setClientWidth ] = useState(null);
  const [ isvisible, setisVisible ] = useState(isVisibleCookie)
  const [ cryptoStr, setCryptoStr ] = useState(userData !== null ? Object.keys(userData).toString() : null)

  function updateUserData(userData) {
    setUserData(userData)
    const data = {
      oldString: `${cryptoStr}-${vsCurrency}`,
      newString: Object.keys(userData).toString(),
      newFiat: vsCurrency
    }
    setCryptoStr(data.newString)
  }


    
  function getData(cryptoId, vs_currency) {
    
    let url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${vs_currency}&ids=${cryptoId}&order=market_cap_desc&per_page=100`
    url += `&page=1&sparkline=false&price_change_percentage=1h,24h,7d,30d,1y`

    const { data } = useSWR(url, fetcher, { refreshInterval: 10000 })
    return data
  }

  useEffect( async () => {
    if (session) {
      window.addEventListener('resize', () => {
        let type = document.body.clientWidth > 799 ? 'desktop' : 'mobile'
        if (type !== clientWidth) setClientWidth(type)
      }) 
      
      document.body.clientWidth > 799 ? setClientWidth('desktop') : setClientWidth('mobile')
      
      let userVal = await fetch('/api/user/get-user')
      .then(resp => resp.json())
      .then(async resp => {
        if (resp.error) {
          console.log(resp.error)
        } else {
          console.log('had sess req')
          return resp
        }
      })
      setUserData(userVal)
      setCryptoStr(Object.keys(userVal).toString())
      

      console.time('get-data')
    } else {
      signIn()
    }
    
  }, [])


  function changeVisibility() {

    let now = new Date()
    const time = now.getTime()
    const expireTime = time + (1000 * 60) * 60 * 24 * 60
    now.setTime(expireTime)

    if (isvisible === true) {
      setisVisible(false)
      document.cookie = `isVisible=false;expires='${now.toUTCString()}';path=/;`
    } else {
      setisVisible(true)
      document.cookie = `isVisible=true;expires='${now.toUTCString()}';path=/;`
    }
  }

  let data = getData(cryptoStr, vsCurrency)

  // testar sem || typeof data === 'undefined'  em prod
  if (cryptoStr === null || !data) return <div className="container">Carregando</div>

  //console.log(cryptoStr, data)

  if (Object.keys(data).includes('status')) {
    console.log('status err', data.status)
    if (data.status.error_code === 429) return <div className="container">Matou a API :(</div>
  }
  
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
        el.user_crypto_amount = el.current_price * val.qtd

        account_total += el.user_crypto_amount

      }

    }
  }
  //console.log('account_total', account_total)
  
  return (
    <>
      <Modal updateUserData={updateUserData} isAdd={isAdd} />
      <div className="container">
        
        <main className={styles.main}>
          <h1 className={styles.title}>Olá, {session.user.name}</h1>
          <h2 className="user-total-amount">
            Total em conta: <span>{ isvisible === true ? formatCurrency(account_total, vsCurrency): notVisible }</span>
          </h2>

          <div className="btn-container">
            <button id="add-crypto-btn" onClick={() => openModal('add', setIsAdd)}>Adicionar Crypto</button>
            <button id="hide-user-values" onClick={() => changeVisibility()}><img src={isvisible === true ? '/icons/lock.svg' : '/icons/unlock.svg'} /></button>
          </div>

          <span className={styles.description}>
            Acompanhe aqui o seu portfolio
          </span>
          {clientWidth === 'desktop'
          ? <DesktopView marketData={data} setIsAdd={setIsAdd} userData={userData} isvisible={isvisible} vsCurrency={vsCurrency} /> 
          : <MobileView marketData={data} setIsAdd={setIsAdd} userData={userData} isvisible={isvisible}  vsCurrency={vsCurrency} />}
          <style jsx>{`

            .user-total-amount {
              text-align: center;
            }

            .table-head, .card {
              grid-template-areas:
                  "name qtd 24h cost price total edit";
              width: 100%;
              grid-template-columns: 25% 6% 15% 15% 17% 17% 2%;
            }

            .col-1 {
              grid-area: name;
              margin-left: 10px;
            }

            .col-2, .col-3, .col-4, .col-5, .col-6 {
              text-align: right;
            }

            .col-2 {
              text-align: right;
              grid-area: qtd;
            }

            .col-3 {
              grid-area: 24h;
            }

            .col-4 {
              grid-area: cost;
            }

            .col-5 {
              grid-area: price;
            }

            .col-6 {
              grid-area: total;
              text-align: center;
            }

            .col-7 {
              grid-area: edit;
            }

            /* --- */

            .total-amount, .amount-spent, .user-qtd {
              font-weight: bold;
            }

            .amount-spent, .current-price {
              color: #626262;
            }

            .edit-btn {
              background: unset;
              border: unset;
              cursor: pointer;
            }

            .edit-btn img {
              width: 20px;
            }

            .btn-container {
              display: flex;
              align-items: center;
              height: 100%;
            }

            .btn-container button {
              font-size: 1rem;
              cursor: pointer;
              border: 1px solid transparent;
              border-radius: 0.375rem;
              min-height: 35px;
              padding-left: 10px;
              padding-right: 10px;
            }

            .btn-container #add-crypto-btn {
              height: 35px;
              background: #3f51b5;
              color: white;
            }

            .btn-container #hide-user-values {
              background-color: lightgrey;
              margin-left: 15px;
            }

            .btn-container #hide-user-values img {
              width: 1.3rem;
            }

            `}</style>
      
        </main>
      </div>
    </>
  )
  
}

export default ({ session, isVisibleCookie, userVal, vsFiat }) => {

  const [ vsCurrency, setVsCurrency ] = useState(vsFiat)

  // botar load shimmer e pegar userVal no front?

  return (
    <>
      <Head>
        <title>Dashboard</title>
      </Head>
      <Header vsCurrency={vsCurrency} setVsCurrency={setVsCurrency} />
      <Content vsCurrency={vsCurrency} session={session} isVisibleCookie={isVisibleCookie} userVal={userVal}  />
    </>
  )
}