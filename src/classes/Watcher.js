

// encontrar meio pra mostrar erro na pag sem tirar o data
// https://stackoverflow.com/questions/9781218/how-to-change-node-jss-console-font-color

async function fetchUrl(url) {
  // fetch only current-price and market-cap

  let error = {}

  let baseUrl = process.env.API_BASE_URL || 'https://projeto-crypto.herokuapp.com/'

  const urlToFetch = `${baseUrl}${url}`
  const data = await fetch(urlToFetch).then(resp => {
    if(resp.status !== 200) error = { status: resp.status, text: resp.statusText }
    //return {message: {code: 'teste', message: 'deuruim'}}
    return resp.json()
  }).catch(err => {
    console.log('err', err)
    return { error: err }
  })

  if (data.error) {
    error.error = data.error
    return { error }
  }
  
  return data
}

export class Watcher {
  
  constructor(name, url) {
    this.name = name
    this.url = url
    this.data = {}
    this.lastUserActivity = null
  }

  async monitorPage(io) {

    //let newBitcoin = fetchCryptoData(name)
    await fetchUrl(this.url)
    .then( newCrypto => {

      const date = new Date()
  
      const storedCrypto = this.data

      // se tiver erro, retornar valor antigo
      if (newCrypto.message || newCrypto.error) {
        console.log('Erro ao pegar valor novo:', newCrypto)
        return storedCrypto
      }

  
      if (JSON.stringify(newCrypto) === JSON.stringify(storedCrypto)) {
        console.log(`\x1b[33m${date} \x1b[36m[${this.name}]: \x1b[37migual `)
      } else {
        this.data = newCrypto
        console.log(`\x1b[33m${date} \x1b[36m[${this.name}]: \x1b[37mdiff `)
        io.to(this.name).emit('update', newCrypto)
      }  

    })
    //checkUserActivity()

  }

  async startMonitoring(io) {

    this.data = await fetchUrl(this.url)
    
    if(this.data.error) {
      console.log('Não será possível iniciar o monitoramento por conta do erro', this.data.error.status)
      return
    }

    console.log('\n\n *** Criado monitoramento para', this.name, '***\n\n')
    
    // start interval
    this.interval = setInterval( async () => {
      await this.monitorPage(io)
    }, 1000 * 15)
  }

  stopMonitoring() {
    console.log(`\n\n\n *** Monitoramento de ${this.name} parado *** \n\n\n`)
    clearInterval(this.interval)
  }

}


export class Crypto extends Watcher {
  
  constructor(name) {
    super(name);
    this.url = `/api/crypto/get-crypto?id=${this.name}`
  }

  async startMonitoring(io) {

    this.data = await fetchUrl(this.url)
    
    if(this.data.error) {
      console.log('Não será possível iniciar o monitoramento por conta do erro', this.data.error.status)
      return
    }

    console.log('\n\n *** Criado monitoramento para criptomoeda:', this.name, '***\n\n')
    
    // start interval
    this.interval = setInterval( async () => {
      await this.monitorPage(io)
    }, 1000 * 15)
  }

}

export class MultiCrypto extends Watcher {
  
  constructor(name, socketName, url) {
    super(name, url);
    this.socketName = socketName
  }

  
  async monitorPage(io) {

    //let newBitcoin = fetchCryptoData(name)
    await fetchUrl(this.url)
    .then( newCrypto => {

      const date = new Date()
  
      const storedCrypto = this.data

      // se tiver erro, retornar valor antigo
      if (newCrypto.message || newCrypto.error) {
        console.log('Erro ao pegar valor novo:', newCrypto)
        return storedCrypto
      }

  
      if (JSON.stringify(newCrypto) === JSON.stringify(storedCrypto)) {
        console.log(`\x1b[33m${date} \x1b[36m[${this.name}]: \x1b[37migual `)
      } else {
        this.data = newCrypto
        console.log(`\x1b[33m${date} \x1b[36m[${this.name}]: \x1b[37mdiff `)
        io.to(this.socketName).volatile.emit('update', newCrypto)
      }  

    })
    //checkUserActivity()
  }

}
