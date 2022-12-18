require("dotenv").config();

const fetch = require('node-fetch')
const { MongoClient, ObjectId } = require("mongodb");
const client = new MongoClient(process.env.DATABASE_URL);



function formatStrDate(dia, usaHoras) {
    
  if(dia === null) return null

  let day, month, year
  day = dia.getDate()
  month = dia.getMonth() + 1
  year = dia.getFullYear()

  day = day < 10 ? '0' + day : day
  month = month < 10 ? '0' + month : month

  let specificTiming = ''
  if (usaHoras) {
    let hour, min, sec

    hour = dia.getHours()
    min = dia.getMinutes()
    sec = dia.getSeconds()

    hour = hour < 10 ? '0' + hour : hour
    min = min < 10 ? '0' + min : min
    sec = sec < 10 ? '0' + sec : sec

    specificTiming = ` - ${hour}:${min}:${sec}`

  }
    
  return `${year}/${month}/${day}${specificTiming}`
  return `${day}/${month}/${year}${specificTiming}`

}



const dbName = "users";

async function run() {
  await client.connect();
  console.log('Conexão com mongodb feita');
  const db = client.db(dbName);

  const users = await db.collection('data').find().toArray().then(data=>data).catch(err=>err)
  
  for(let val of users) {
    const cryptos = val.cryptos

    const currencies = ['brl', 'usd']
    let fullData = {}

    const cryptosId = Object.keys(cryptos).toString()

    for(let vs_currency of currencies) {

      let url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${vs_currency}&ids=${cryptosId}&order=market_cap_desc&per_page=100`
      url += `&page=1&sparkline=false&price_change_percentage=1h,24h`
      
      const maindata = await fetch(url).then(resp => resp.json())

      let currencyData = createData(maindata, cryptos)
    
      fullData[vs_currency] = currencyData
      //fullData[vs_currency].total_price = currencyData.total_price
  
    }
    const strData = formatStrDate(new Date())

    let finalData = fullData

    console.log(finalData)

    //console.log(finalData)
    let insert = await db.collection('historic-total').findOneAndUpdate({ username: val.username }, { $set: { [strData]:  finalData } }, { returnDocument: 'after' });
    if(insert.value === null) {
      finalData = {
        id: ObjectId(val._id),
        username: val.username,
        [strData]: fullData
      }
      insert = await db.collection('historic-total').insertOne(finalData);
      console.log('insert done?', insert.acknowledged)
    } else {
      console.log(insert.value)
    }

    let dailyData = {
      brl: {
        total: fullData.brl.total_price
      },
      usd: {
        total: fullData.usd.total_price
      },
      day: strData
    }

    
    insert = await db.collection('daily-total').findOneAndUpdate({ username: val.username }, { $set: { [strData]:  dailyData } }, { returnDocument: 'after' });
    if(insert.value === null) {
      finalData = {
        id: ObjectId(val._id),
        username: val.username,
        [strData]: dailyData
      }
      insert = await db.collection('daily-total').insertOne(finalData);
      console.log('insert done?', insert.acknowledged)
    } else {
      console.log(insert.value)
    }
    

    /*
    for(let i = 10; i < 16; i++) {

      let strData2 = `2022/12/${i}`

      dailyData.brl.total = dailyData.brl.total - (i * 100)
      dailyData.usd.total = dailyData.usd.total - (i * 10)

      dailyData.day = strData2

      console.log('t', dailyData.brl.total)

      insert = await db.collection('daily-total').findOneAndUpdate({ username: val.username }, { $set: { [strData2]:  dailyData } }, { returnDocument: 'after' });
      if(insert.value === null) {
        finalData = {
          id: ObjectId(val._id),
          username: val.username,
          [strData2]: dailyData
        }
        insert = await db.collection('daily-total').insertOne(finalData);
        console.log('insert done?', insert.acknowledged)
      } else {
        //console.log(insert.value)
        console.log('ok')
      }
    }
    */
    

  }
  await client.close();

}
run()

function createData(allData, cryptos) {

  let res = {
    total_price: 0
  }

  for(let coin of allData) {

    res[coin.id] = {} 
    let data = res[coin.id]

    let medianPrice = (coin.high_24h + coin.low_24h) / 2
    data.high_24h = coin.high_24h
    data.low_24h = coin.low_24h
    data.median_24h = medianPrice
    data.user_value = medianPrice * cryptos[coin.id].qtd
    data.lastUpdated = coin.last_updated
    res.total_price += data.user_value

    console.log('t', res.total_price)

  }

  res.total_price = Number(res.total_price.toFixed(2))

  return res

}
