import { parse } from "dotenv";
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

  const { total_spent, qtd } = parsedHeader
  let { name } = parsedHeader
  name = name.toLowerCase()

  let findCrypto = await fetch(`${req.headers.origin}/api/crypto/get-crypto?id=${name}`).then(resp => resp.json())

  if(findCrypto.error) {

    findCrypto.msg = findCrypto.error === 'Could not find coin with the given id' ? `A crypto ${name} não foi encontrada` : findCrypto.error

    return res.status(500).json({error: findCrypto})
  }

  const client = await pool.connect();

  let queryText = `
    UPDATE users
    set cryptos = jsonb_insert(cryptos, $1, $2)
    WHERE users.id = $3 RETURNING cryptos;
  `
  

  const data = {
    total_spent: total_spent,
    qtd: qtd,
    currency_spent: 'brl'
  }


  const sendData = {
    text: queryText,
    values: [`{${name}}`, data, id]
  }

  //console.log(data, id)

  try {
    const query = await client.query(sendData)
    res.status(200).json(query.rows[0].cryptos)
  } catch(e) {
    let err = e
    err.msg = 'Erro ao adicionar crypto'
    if(e.code === '22023') err.msg = 'Esse valor já foi adicionado'

    console.log(err)
    res.status(500).json({error: err})
  } finally {
    client.release();
  }


  //let query = await client.query('SELECT * FROM users')
  
}