
import { route } from 'next/dist/server/router';
//import { useRouter } from 'next/router'

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

class Expense {
    constructor(name, cost) {
      this.name = name;
      this.cost = cost;
      this.description = description;
      this.isPaid = isPaid;
      this.payment_method = payment_method;
      this.payment_date = payment_date;
    }
  }


export default async function handler (req, res) {


  const { query } = res

  if(!query.id) return res.status(500).json({error: 'no Id added'})

  const id = typeof req.query.id == 'undefined' ? 'dogecoin' : req.query.id

  const { MongoClient, ObjectId } = require("mongodb");
  const client = new MongoClient(process.env.DATABASE_URL);
  await client.connect();
  console.log('Conexão com mongodb feita');
  const db = client.db(dbName);

  const users = await db.collection('expenses').find({  }).toArray().then(data=>data).catch(err=>err)  

  const currencies = ['brl', 'usd']
  let fullData = {
      'jan': [],
      'feb': [],
      'mar': [],
      'apr': [],
      'may': [],
      'jun': [],
      'jul': [],
      'aug': [],
      'sep': [],
      'oct': [],
      'nov': [],
      'dec': [],
  }


  let finalData = fullData

  console.log(finalData)

  //console.log(finalData)
  let insert = await db.collection('expenses').findOneAndUpdate({ username: val.username }, { $set: { [strData]:  finalData } }, { returnDocument: 'after' });
  if(insert.value === null) {
    finalData = {
      user_id: ObjectId(val._id),
      //username: val.username,
      [strData]: fullData
    }
    insert = await db.collection('expenses').insertOne(finalData);
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

}