//import { useRouter } from 'next/router'
import styles from '../../stylesheet/pages/cryptos.module.css'
//import { useEffect } from 'react'
import Chart from '../../components/crypto/chart'
import useSWR from 'swr'

/*

  Possíveis cores pro site:
    azul: #0052ff
    preto
  
  


  <!-- socket.js

   https://socket.io/docs/v3/emitting-events/
   https://github.com/socketio/socket.io/discussions/4210 -- salvou o projeto

   https://dev.to/kalpitrathore/various-ways-of-real-time-data-communication-in-node-js-1h2b

   https://socket.io/docs/v3/rooms/

    socket.js -->

*/


// <!-- [CRYPTOID]

// https://nextjs.org/learn/seo/introduction-to-seo
 

// store currency and lang pref somewhere
// https://www.coingecko.com/en/api/documentation
// use websocket to fetch real time data nodejs -- done (almost real time)
// integrate websocket somehow??? -- done
// https://thoughtbot.com/blog/real-time-online-activity-monitor-example-with-node-js-and-websocket
// https://blog.logrocket.com/implementing-websocket-communication-next-js/
// https://blog.logrocket.com/websockets-tutorial-how-to-go-real-time-with-node-and-react-8e4693fbf843/

// [CRYPTOID] -->



// https://socket.io/docs/v3/emitting-events/
// https://github.com/socketio/socket.io/discussions/4210

// https://dev.to/kalpitrathore/various-ways-of-real-time-data-communication-in-node-js-1h2b

// https://socket.io/docs/v3/rooms/
// https://javascript.plainenglish.io/how-to-cache-api-calls-in-next-js-f4b6aefa84f1?gi=50b2fe6fe611
// https://dev.to/vadorequest/a-2021-guide-about-structuring-your-next-js-project-in-a-flexible-and-efficient-way-472


/*

  Objetivos p/ agr relacionados ao backend: 
    puxar somente as informações que importam da API ?
    puxar vs_currencies tb -- essa pag ok
    trocar o maximo de let p/ const possivel
    achar uma folder structure boa
    achar meio p/ renderizar somente os preços novos em [cryptoId] -- ok

  P/ frontend:
    criar head p/ pesquisa


  P/ "longo" prazo (3 meses):
    montar tooltip em old-chart p/ começar a usar ele


  Notas:
    Vercel não permite uso de websocket
      - https://stackoverflow.com/questions/65379821/cant-connect-to-websocket-server-after-pushing-to-vercel
      - https://stackoverflow.com/questions/70606156/socketio-with-nextjs-deployed-to-vercel-socket-is-not-connecting
    Como host será na vercel:
      - https://vercel.com/docs/concepts/solutions/realtime
      - https://swr.vercel.app/
      - https://swr.vercel.app/docs/getting-started

*/



const fetcher = (...args) => fetch(...args).then(res => res.json())

function formatCurrency(number, currency, lang) {

  lang = typeof lang == 'undefined' ? 'pt-BR' : lang
  currency = typeof currency == 'undefined' ? 'BRL' : currency

  const res = new Intl.NumberFormat(lang, { style: 'currency', currency: currency }).format(number)
  return res
}


// getServerSideProps
export async function getServerSideProps(context) {

  // isso só ta aqui p/ dar tempo de inicializar o useRouter()
  const cryptoId = context.params.cryptoId

  return { props: { cryptoId } }
}

const fiatPreference = 'brl'

function getData(cryptoId) {
  const { data } = useSWR(`/api/crypto/get-crypto?id=${cryptoId}`, fetcher)
  return data
}

function Price({ name }) {
  
  const data = getData(name)

  if(!data) return <div>Carregando</div>

  //console.log(data)
  
  // maybe create a 404 template?
  if(data.error) return <div>Error {data.status} {data.error}</div>
  if(data.errno) return <div>Error {data.errno} (provavelmente deu ruim na API) :(</div>

  if(typeof data.image.small === 'undefined') console.log(data)

  return (
    <div>
      <div>
        <div className={styles['first-part']}>
          <img src={data.image.small} />
          <h1>{data.name}</h1>
        </div>
        <div className={styles['price-container']}>
          <span className={styles.price}>{formatCurrency(data.market_data.current_price[fiatPreference])}</span> 
          <span className={`${styles['price-change']} ${data.market_data.price_change_percentage_24h < 0 ? styles['price-down'] : styles['price-up']}`}>
          {data.market_data.price_change_percentage_24h.toFixed(2)}%  ({formatCurrency(data.market_data.price_change_24h_in_currency[fiatPreference])}) 
          </span>
        </div>
      </div>
      <div className={styles['market-cap']}> 
        <span>Market cap: <span id={styles['market-cap-val']}>{formatCurrency(data.market_data.market_cap[fiatPreference])}</span> </span>
        <span className={`${styles['market-change']} ${data.market_data.market_cap_change_percentage_24h < 0 ? styles['price-down'] : styles['price-up']}`}>
          {data.market_data.market_cap_change_percentage_24h.toFixed(2)}%
        </span>
      </div>
    </div>
  )

}

const Crypto = ({ cryptoId }) => {


  //console.log('cryptoId', cryptoId)

  return (
    <div className={styles.crypto}>
        <Price name={cryptoId} />
      <div className={styles['chart-container']}>
        <Chart name={cryptoId} vs_currency={fiatPreference}></Chart>
      </div>
    </div>


  )

}

export default Crypto