import { useSession, getSession, signIn } from "next-auth/react"
import Header from "../components/elements/header"
import React, { useState, useEffect } from 'react';
import styles from '../stylesheet/components/table.module.css'
import { formatCurrency, getCurrentFiat, fetcher } from '../components/general-scripts/reusable-scripts'
import Head from 'next/head'
import Modal from '../components/elements/modal'
import useSWR from 'swr'

let notVisible = '*****'
let cryptoString
//let vsFiat

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

  let isVisibleCookie = context.req.headers.cookie
  if (isVisibleCookie.search('isVisible') > -1) {
    isVisibleCookie = isVisibleCookie.split('isVisible=')[1]
    isVisibleCookie = isVisibleCookie.split(';')[0]
    console.log('isVisibleCookie', isVisibleCookie)
    isVisibleCookie = isVisibleCookie === 'false' ? false : true
  } else {
    console.log('cookie não encontrado')
    console.log(isVisibleCookie)
    isVisibleCookie = true
  }
  return {
    props: { session, isVisibleCookie }
  }
}

function getData(cryptoId, vs_currency) {
  const { data } = useSWR(`/api/crypto/get-many-crypto?id=${cryptoId}&fiat=${vs_currency}`, fetcher, { refreshInterval: (1000 * 15) })
  return data
}

const Profile = ({ session, isVisibleCookie, cryptoStr, setCryptoStr, vsCurrency, setVsCurrency }) => {


  const [ userData, setUserData ] = useState(null);
  const [ isAdd, setIsAdd ] = useState(false);
  const [ clientWidth, setClientWidth ] = useState(null);
  const [ isvisible, setisVisible ] = useState(isVisibleCookie)
  let data

  function updateUserData(userData) {
    setUserData(userData)
    const data = {
      oldString: `${cryptoStr}-${vsCurrency}`,
      newString: Object.keys(userData).toString(),
      newFiat: vsCurrency
    }
    //if (socket) socket.emit('change-room', data)
    console.log('new cryptoString', data.newString)
    setCryptoStr(data.newString)
    cryptoString = data.newString
  }

  useEffect( async () => {

    console.log('here')
    
    let vsFiat = getCurrentFiat()
    setVsCurrency(vsFiat)

    if (session) {
      window.addEventListener('resize', () => {
        let type
        if (window.innerWidth > 799) {
          type = 'desktop'
        } else {
          type = 'mobile'
        }

        if (type !== clientWidth) setClientWidth(type)
      }) 
      
      if (window.innerWidth > 799) {
        setClientWidth('desktop')
      } else {
        setClientWidth('mobile')
      } 

      console.time('get-data')
      await fetch('/api/user/get-user')
      .then(resp => resp.json())
      .then(async resp => {
        if (resp.error) {
          alert(resp.error)
        } else {
          setUserData(resp)
          cryptoString = Object.keys(resp).toString()
          setCryptoStr(cryptoString)
          //initializer()
        }

      })

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

  data = getData(cryptoStr, vsCurrency)

  if (typeof cryptoStr === 'undefined' || typeof vsCurrency === 'undefined') data = undefined

  if (userData === null || !data || typeof data === 'undefined' ) return <div className="container">Carregando</div>
  
  // faz merge dos dados
  let account_total = 0

  //const marketData = data

  console.log(cryptoString, data)


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
      <Head>
        <title>Dashboard</title>
      </Head>
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

export default Profile