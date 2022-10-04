import { useSession, signIn, getSession, signOut } from "next-auth/react"
import React, { useState, useEffect } from 'react';
import { SessionProvider } from "next-auth/react"

const Session = () => {

  const { data:session, status } = useSession()

  //console.log('sess header',session, status)

  if(status === 'loading') return <a className='log-btn'></a>

  //{session.user.name}

  if (session) {
    return (
      <>
        <a onClick={(e) => signOut()} className='log-btn'>Logout</a>
      </>
    )
  }

  return (
    <>
      <a onClick={(e) => signIn()} className='log-btn'>Login</a>
    </>
  )

}

function searchValue() {

  const val = document.querySelector('#list-input').value
  window.location.href = `/crypto/${val}`

}


function setRezise() {
  const size = document.querySelector('#list-input').clientWidth + document.querySelector('#submit-search').clientWidth + 2 // 1px p/ cada elemento
  document.querySelector('#crypto-list').style.width = size + 'px'


  // mobile =  the clientHeights +  2 from borders + 15 from margin-top


  // + 2 from borders and /2 to get "margin" between element and the top of the header
  const calcDesktop = document.querySelector('#submit-search').clientHeight + 2 + ( ( 50 - (document.querySelector('#submit-search').clientHeight + 2) ) / 2 )

  const mobileCalc = document.querySelector('.header-container .first-col').clientHeight
  + (document.querySelector('.header-right a').clientHeight * 3)
  + document.querySelector('.header-right select').clientHeight +
  + document.querySelector('#list-input').clientHeight + 2 + 15

  const height = document.body.clientWidth < 500 
  ? mobileCalc
  : calcDesktop

  document.querySelector('#crypto-list').style.top = height + 'px'
}


const Header = ({ vsCurrency, setVsCurrency }) => {

  //const [ searchVal, setSearchVal ] = useState(null);
  
  function changeVsCurrency() {
    const value = document.querySelector('.currency-type').value
    let now = new Date()
    const time = now.getTime()
    const expireTime = time + (1000 * 60) * 60 * 24 * 60
    now.setTime(expireTime)

    document.cookie = `vsCurrency=${value};expires='${now.toUTCString()}';path=/;`
    setVsCurrency(value)
  }



  useEffect(() => {
    window.addEventListener('resize', function() {
      setRezise()
    })
    setRezise()
  }, [])

  function startSearch() {

    const name = document.querySelector('#list-input').value

    if (name.length < 3) return document.querySelector('#crypto-list').innerHTML = ''

    setTimeout(() => {
      
      if(name !== document.querySelector('#list-input').value) {
        return console.log('Mudou ', name, document.querySelector('#list-input').value)
      }


      fetch(`/api/crypto/search-crypto?name=${name}`)
      .then(resp => {
        if (resp.ok === true) {
          return resp.json()
        } else {
          console.log(resp)
        }
      })
      .then(resp => {
  
        let str = ''
  
        if (resp[0] === null) return document.querySelector('#crypto-list').innerHTML = ''
  
        for(let val of resp) {
          str += `<div class="list-option" value="${val.id}"><span>${val.name}</span> <img src="${val.thumb}" ></div>`
        }
  
        document.querySelector('#crypto-list').innerHTML = str
  
        document.querySelectorAll('#crypto-list .list-option').forEach(function(el) {
          //console.log(el)
          el.addEventListener('click', function(e) {
            const val = el.getAttribute('value')
            window.location.href = `/crypto/${val}`
          })
        })
      })

    }, 1500)

  }

  function collapseHeader() {

    const isCollapsed = document.querySelector('.header-container').getAttribute('collapsed')

    if (isCollapsed === 'true') {
      //document.querySelector('.header-container').style.maxHeight = '52px'
      document.querySelector('.header-container').setAttribute('collapsed', 'false')
      document.querySelector('#list-input').value = ''
      startSearch()
    } else {
      //document.querySelector('.header-container').style.maxHeight = 'unset'
      document.querySelector('.header-container').setAttribute('collapsed', 'true')
    }
    
    
  }


  return (
    <header>
        <div className="header-container" collapsed="false">
          <div className="first-col">
            <a className="collapse-header hide-desktop" onClick={() => collapseHeader()} >☰</a>
            <a className="home-link" href="/"><img src="/vercel.svg" alt="Vercel" className="logo" /></a>
          </div>
          <div className="second-col" >
            <div className="header-right">
              <a className="" href="/">Home</a>
              <a href="/dashboard" >Dashboard</a>
              <Session />
              <select className="currency-type" value={vsCurrency} onChange={() => changeVsCurrency()}>
                <option value={'brl'}>BRL</option>
                <option value={'usd'}>USD</option>
              </select>
            </div>
            <div className="search-container">
              <input type="text" id="list-input" defaultValue={''} onChange={(e) => startSearch()} />
              <div id="crypto-list"></div>
              <button type="submit" id="submit-search" onClick={(e) => searchValue()}>
                <img src="/icons/search-alt.svg" alt="search" draggable="false" />
              </button>
            </div>
          </div>
        </div>
    </header>
  )

}

export default Header