import { getSession } from "next-auth/react"

const { MongoClient, ObjectId } = require("mongodb");

export default async function handler (req, res) {

  const session = await getSession({ req })
  const id = session.accessToken.id


  const parsedHeader = JSON.parse(req.headers.data)

  const { name, total_spent, qtd } = parsedHeader

  //res.status(200).json('ok')

  //const client = await pool.connect();

  let queryText = `
  UPDATE users
  set cryptos = jsonb_set(cryptos, $1, cryptos->$2 || $3) 
  WHERE users.id = $4 RETURNING cryptos;
  `

  const data = {
    total_spent: total_spent,
    qtd: qtd,
    currency_spent: 'brl'
  }

    
  const client = new MongoClient(process.env.DATABASE_URL);

  const db = client.db('users');
  const col = db.collection("data");

  const result = await col.findOneAndUpdate({ _id: new ObjectId(id) }, { $set: { ["cryptos." + name]:  data } }, { returnDocument: 'after' });  

  return res.status(200).json(result.value.cryptos)

  //res.status(200).json(query.rows[0].cryptos)
  //client.release();


  //let query = await client.query('SELECT * FROM users')
  
}