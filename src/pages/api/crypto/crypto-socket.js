import { user } from 'pg/lib/defaults'
import { Server } from 'socket.io'

//import { Crypto } from '../../../classes/Crypto'
import { Watcher, Crypto, MultiCrypto } from '../../../classes/Watcher'


let io
let crypto = {}
//let index
let users = {}

/*

  Possíveis cores pro site:
    azul: #0052ff
    preto
  
  crypto, index e users objects deverão ser passados para outro lugar
  


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


/*

  URGENTE:
    Instalar jest e criar pelo menos 2 testes automatizados

  Objetivos p/ agr relacionados ao backend: 
    terminar MonitorCrypto -- ok
    Separar as cryptos por "rooms" -- ok
    Ao notar uma diferença, será emitido a versão mais recente para a sua "room" -- ok
    validar p/ n começar websocket caso crypto n exista -- ok
    puxar vs_currencies tb -- ok
    trocar o maximo de let p/ const possivel -- revisar
    achar meio p/ renderizar somente os preços novos em [cryptoId] -- ok
    achar meio p/ resetar websocket ao recompilar código
    achar uma folder structure boa  

  Objetivos p/ frontend:
    criar head p/ pesquisa/search -- ok
    resolver bug no qual input de pesquisa aparece preenchido pela ultima crypto q teve update/add na dashboard (bug aparece ao reiniciar o google no mobile)
      -- achar meio pra reproduzir esse bug pelo pc
      -- achar meio p/ n consumir todas req da API no search
    

  MonitorCrypto:
    MonitorCrypto funcionará como um bot para cada crypto -- si
    Também terá monitoramento p/ usuários -- ok
    criar monitoramentos p/ diferentes moedas ou juntar tudo ? -- req em USD ao invés de BRL
    Transformar em classe com método p/ ativar e desativar monitoramento -- ok
    será separada pelo nome da crypto -- ok
    terá um timer de 5 min até ser desativada -- ok

  

  Para depois (back e front) :
    montar tooltip em old-chart p/ começar a usar ele
    criar método de web push p/ :
      alerta sobre crypto bater um preço X
      aviso "matinal" (08hrs provavelmente) sobre movimentações nas maiores cryptos do mercado (btc, eth) ou movimentações em cryptos selecionadas pelo usuário
    criar esqueleto de dashboard
    adaptar modal p/ ficar mais facil de lidar
    mudar layout de home no mobile p/ ficar semelhante ao layout da dashboard
    passar essa versão p/ o github e substituir a versão da vercel?
    puxar somente as informações que importam da API ?
    criar pag com cryptos que estão "no hype"
    habilitar filtragem por preço, market-cap, etc na home
    
    ***
    centralizar infos em um banco de dados? -- irá impedir delay de monitoramento entre paginas
      Ex:
        Na home é feito nos segundos 0 15 30 45
        Na pag de crypto é feita em 2 17 32 47
        Como há um delay de 2 seg, o preço atualizado pode variar entre as paginas, de tal forma que
        a pagina index pode ter o preço real e a pagina da crypto tenha o preço "desatualizado"
    
    Outra solução p/ isso pode ser conveniente tb :D
    
    ***


  A considerar:
    Passar "let crypto" p/ dentro da file Crypto.js? -- nah
    criar código que me permita fazer emits na hora que eu quiser >:D
  

  Deixar o bot das minhas queridinhas ligados automáticamente? (btc, eth, xmr) -- nah por enquanto
  // heroku ps:scale web=0
  // https://projeto-crypto.herokuapp.com/crypto/bitcoin :D

  // forçar https

  // folder structure


  http://localhost:3000/api/crypto/get-many-crypto?id=ethereum&vs-currency=usd

  https://medium.com/@pablo.delvalle.cr/an-opinionated-basic-next-js-files-and-directories-structure-88fefa2aa759
  https://dev.to/vadorequest/a-2021-guide-about-structuring-your-next-js-project-in-a-flexible-and-efficient-way-472
  https://hackernoon.com/how-to-structure-your-react-app-98c48e102aad -- react



  passar cryptoStr e vsCurrency como valores p/ _app.js


*/

function checkUserActivity(key) {

    const el = users[key] ? users[key] : crypto[key]
  
    let min = 0

    let innerInterval = setInterval(() => {

      if (el.lastUserActivity === null || io.sockets.adapter.rooms.get(key)) {
        console.log(`\x1b[36m[${el.name}]: \x1b[37mPossui ${io.sockets.adapter.rooms.get(key).size} usuário ativo, portanto não será fechada`)
        if (users[key]) {
          users[key].lastUserActivity = null
        } else {
          crypto[key].lastUserActivity = null
        }

        return clearInterval(innerInterval)
      }


      let validateTime = new Date(el.lastUserActivity.valueOf())
      validateTime.setUTCMinutes(validateTime.getMinutes() + 5)
      //validateTime.setUTCSeconds(validateTime.getSeconds() + 20) // dev
  
      const now = new Date()
  
      let diff = validateTime - now
      diff = (diff / 1000)

      if (now > validateTime) {
        console.log(`\x1b[36m[${el.name}]: \x1b[37mPor estar 5 minutos sem um usuário ativo, será encerrado`)
        el.stopMonitoring()
        if (users[key]) {
          delete users[key]
        } else {
          delete crypto[key]
        }
        clearInterval(innerInterval)
      } else {
        if (min === 10) {
          console.log(`\x1b[36m[${el.name}]:\x1b[37m ${diff} segundos restantes até ser fechado (${(diff / 60)} min)`)
          min = 0
        }
        min++
      }

    }, 1000)
    
}

//const favorites = ['bitcoin', 'monero', 'ethereum'] 
const favorites = [] 

async function monitorMyFavorites(io) {

  for(let val of favorites) {
    crypto[val] = new Crypto(val)
    await crypto[val].startMonitoring(io)
  }

}


const SocketHandler = async (req, res) => {
  if (!res.socket.server.io) {
    
    console.log('\n\n\n*** First use, starting socket.io ***\n\n\n')
    
    io = new Server(res.socket.server)

    const indexCryptos = 'bitcoin,ethereum,monero,smooth-love-potion,polygon,binancecoin,usd-coin,solana,polkadot,dogecoin,litecoin,gala,cardano,magic-internet-money'
    
    /*    const indexCryptos = 'bitcoin,ethereum,monero,smooth-love-potion,polygon,binancecoin,usd-coin,solana,polkadot,dogecoin,litecoin,gala,cardano,magic-internet-money'
    console.time('Preparando as favoritas')
    //await monitorMyFavorites(io)
    console.timeEnd('Preparando as favoritas')
    */


    io.on('connection', socket => {
      //console.log('new connection')

      // single-crypto
      socket.on('single-crypto', async msg => {
        socket.join(msg); // join room from crypto
        if (!Object.keys(crypto).includes(msg)) {
          crypto[msg] = new Crypto(msg)
          await crypto[msg].startMonitoring(io)
        }

        if(!crypto[msg].data.error) {
          socket.emit('data', crypto[msg].data)
        } else {
          socket.emit('data', crypto[msg].data.error)
          delete crypto[msg]
        }

      })


      /*
      // user-socket
      socket.on('hello', async msg => {
        
        let socketName = `${msg.name}-${msg.fiat}`

        socket.join(socketName); // join room from crypto
        if (!Object.keys(crypto).includes(socketName)) {
          crypto[socketName] = new Crypto(socketName)
          await crypto[socketName].startMonitoring(io)
        }

        if(!crypto[socketName].data.error) {
          socket.emit('data', crypto[socketName].data)
        } else {
          socket.emit('data', crypto[socketName].data.error)
          delete crypto[socketName]
        }

      })
      */


      socket.on('multi-values', async msg => {

        let socketName = `${msg.name}-${msg.fiat}`
        let cryptoId = msg.name === 'index-homepage' ? indexCryptos : msg.name

        socket.join(socketName)

        if (!Object.keys(users).includes(socketName)) {
          users[socketName] = new MultiCrypto(`user-watcher - ${socketName}`, socketName, `/api/crypto/get-many-crypto?id=${cryptoId}&fiat=${msg.fiat}`)
          await users[socketName].startMonitoring(io)
        }
        users[socketName].lastUserActivity = null

        if (!users[socketName].data.error) {
          socket.emit('data', users[socketName].data)
        } else {
          socket.emit('data', users[socketName].data.error)
          delete users[socketName]
        }

      })

      socket.on('change-room', async data => {

        console.log(`Troca de room \x1b[36m${data.oldString} \x1b[37mpara \x1b[36m${data.newString}-${data.newFiat}\x1b[37m`)
        let oldString = data.oldString

        if (io.sockets.adapter.rooms.get(data.oldString)) {
          
          console.log(`\x1b[37mO monitoramento de \x1b[36m[users: ${data.oldString}] \x1b[37mserá fechado em 5 minutos caso não haja usuários ativos`)

          //if (data.newString.includes('index-homepage')) oldString = `-${data.oldFiat}`
          
          users[oldString].lastUserActivity = new Date()
          checkUserActivity(oldString)  
          socket.leave(oldString)
        } else {
          console.log('\x1b[37moldString não encontrada para realização de change-room')
          console.log('oldStr', oldString)
          console.log(io.sockets.adapter.rooms)
        }

        let cryptos = `${data.newString}-${data.newFiat}`
        socket.join(cryptos)
        if (!Object.keys(users).includes(cryptos)) {
          if (data.newString.includes('index-homepage')) {
            //cryptos = `index-homepage-${data.newFiat}`
            users[cryptos] = new MultiCrypto(`user-watcher - ${cryptos}`, cryptos, `/api/crypto/get-many-crypto?id=${indexCryptos}&fiat=${data.newFiat}`)
          } else {
            //cryptos = `${cryptos}-${data.newFiat}`
            users[cryptos] = new MultiCrypto(`user-watcher - ${cryptos}`, cryptos, `/api/crypto/get-many-crypto?id=${data.newString}&fiat=${data.newFiat}`)
          }
          await users[cryptos].startMonitoring(io)
        }
        users[cryptos].lastUserActivity = null

        if(!users[cryptos].data.error) {
          socket.emit('data', users[cryptos].data)
        } else {
          socket.emit('data', users[cryptos].data.error)
          delete users[cryptos]
        }

      })

      socket.on('connect_error', (reason) => {
        console.log('Error ao se conectar com user', reason)
      })
      

      socket.on("disconnect", (reason) => {
        console.log('disconnect', reason)
      });



      socket.on("disconnecting", () => {
        console.log('tem gente saindo')
        handleDisconnect(socket)
      });

      socket.on('leave-room', () => {
        console.log('leave-room')
        handleDisconnect(socket)
      });

    })

    res.socket.server.io = io

  } else {
    console.log('socket.io already running')
    //let io = res.socket.server.io
    //delete res.socket.server.io
  }
  res.end()
}



function handleDisconnect(socket) {

  //console.log('leaving')
  //console.log('rooms', socket.adapter.rooms.keys())

  for (const [key, value] of socket.adapter.rooms) {
    
    if (value.has(socket.id) && key !== socket.id) {

      
      console.log('tem o socket', key)
      console.log('tamanho do room', key, ':', value.size)

      if (favorites.includes(key)) {
        console.log(`A crypto ${key} não será fechada por ser uma das favoritas`)
        break;
      }

      // single-crypto || user-socket || index-homepage
      if (value.size === 1 && (crypto[key] || users[key] ) ) {
        console.log(`\x1b[37mO monitoramento de \x1b[36m[${key}] \x1b[37mserá fechado em 5 minutos caso não haja usuários ativos`)

        users[key] ? users[key].lastUserActivity = new Date() : crypto[key].lastUserActivity = new Date()

        checkUserActivity(key)
        //delete crypto[key]
        break;
      }

    }
    
  }
}



export default SocketHandler