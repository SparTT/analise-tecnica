import { getSession } from "next-auth/react"
const { Pool } = require('pg');

const dbUrl = process.env.DATABASE_URL
const pool = new Pool({
  connectionString:  dbUrl, // process.env.DATABASE_URL
  ssl: {
    rejectUnauthorized: false
  }
});

export default async (req, res) => {
  const session = await getSession({ req })

  //console.log('session', session)
  
  const sessionAcessToken = typeof req.query.session_accessToken !== 'undefined' ? req.query.session_accessToken : null

  const client = await pool.connect();

  if (session === null && sessionAcessToken === null) {
    res.status(200).json({error: 'User not found'})
  } else {
    let userParam = sessionAcessToken !== null ? sessionAcessToken : session.accessToken.sub
    const query = await client.query('SELECT cryptos FROM users WHERE id = $1', [ userParam ])
    //console.log('query', query.rows)
    res.status(200).json(query.rows[0].cryptos)
  }
  client.release()

}