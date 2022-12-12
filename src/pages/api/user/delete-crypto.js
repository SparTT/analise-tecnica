import { getSession } from "next-auth/react"
const { MongoClient } = require("mongodb");

export default async function handler (req, res) {

  const session = await getSession({ req })
  const username = session.accessToken.username


  const parsedHeader = JSON.parse(req.headers.data)

  const { name } = parsedHeader


  const client = new MongoClient(process.env.DATABASE_URL)

  const db = client.db('users')
  const col = db.collection("data")

  const result = await col.findOneAndUpdate({ username: username }, { $unset: { ["cryptos." + name]:  1 } }, { returnDocument: 'after' });  

  return res.status(200).json(result.value.cryptos)

  //res.status(200).json('ok')

  //const client = await pool.connect();

  let queryText = `UPDATE users SET cryptos = cryptos - $1 WHERE users.id = $2 RETURNING cryptos;`

  const sendData = {
    text: queryText,
    values: [name, id]
  }

  //console.log(data, id)

  const query = await client.query(sendData)

  res.status(200).json(query.rows[0].cryptos)
  client.release();


  //let query = await client.query('SELECT * FROM users')
  
}