import { getSession } from "next-auth/react"
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

export default async (req, res) => {
  const session = await getSession({ req })

  const client = await pool.connect();

  if (session === null) {
    res.status(500).json({error: 'User not found'})
  } else {
    const query = await client.query('SELECT cryptos FROM users WHERE id = $1', [ session.accessToken.sub ])
    //console.log('query', query.rows)
    res.status(200).json(query.rows[0].cryptos)
  }
  client.release()

}