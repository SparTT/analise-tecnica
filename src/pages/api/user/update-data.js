import { getSession } from "next-auth/react"
const { Pool } = require('pg');

const dbUrl = process.env.DATABASE_URL
const pool = new Pool({
  connectionString:  dbUrl, // process.env.DATABASE_URL
  ssl: {
    rejectUnauthorized: false
  }
});

export default async function handler (req, res) {

  const session = await getSession({ req })
  const id = session.accessToken.sub


  const parsedHeader = JSON.parse(req.headers.data)

  const { name, total_spent, qtd } = parsedHeader

  //res.status(200).json('ok')

  const client = await pool.connect();

  let queryText = `
  UPDATE users
  set cryptos = jsonb_set(cryptos, $1, cryptos->$2 || $3) 
  WHERE users.id = $4 RETURNING cryptos;
  `

  const data = {
    total_spent: total_spent,
    qtd: qtd
  }


  const sendData = {
    text: queryText,
    values: [`{${name}}`, name, data, id]
  }

  //console.log(data, id)

  const query = await client.query(sendData)

  res.status(200).json(query.rows[0].cryptos)
  client.release();


  //let query = await client.query('SELECT * FROM users')
  
}