/*

        spent_history: [
          {
            day: '17/12/2020',
            spent: 4500,
            crypto_qtd: 1.1
          },
          {
            day: '17/11/2019',
            spent: 500,
            crypto_qtd: 0.1
          }
        ]
*/


const dbUrl = process.env.DATABASE_URL

const { Pool } = require('pg');
const pool = new Pool({
  connectionString:  dbUrl, // process.env.DATABASE_URL
  ssl: {
    rejectUnauthorized: false
  }
});

/*

  const cryptos = {
    bitcoin: { 
      qtd: 0.1, 
      total_spent: 5000, 
      currency_spent: 'brl'
    },
    ethereum: { 
      qtd: 1.2, 
      total_spent: 550, 
      currency_spent: 'brl'
    }
  }


  set cryptos = jsonb_set(cryptos, '{ethereum,total_spent}', '554');
  set cryptos = jsonb_set(cryptos, '{ethereum,qtd}', '1.1');

  //  set cryptos = jsonb_set(cryptos, '{ethereum,total_spent}', '553' || '{ethereum,qtd}', '1.11') 

  UPDATE users
  set cryptos = jsonb_set(cryptos, $1, cryptos->$2 || $3) 
  WHERE users.name = $4 RETURNING cryptos;

  // delete
  queryText = `UPDATE users SET cryptos = cryptos - 'dogecoin' WHERE users.name = 'teste' RETURNING cryptos;`

*/

async function exe() {
    

  const client = await pool.connect();

  let queryText = `UPDATE users SET cryptos = cryptos - 'adwad' WHERE users.name = 'teste' RETURNING cryptos;`
  

  let name = 'ethereum'

  let data = {
    total_spent: 800,
    currency_spent: 'brl',
    qtd: 1.25
  }

  console.log(data)


  const sendData = {
    text: queryText,
    values: [`{${name}}`, name, data]
  }

  let x = await client.query(queryText)
  console.log(x.rows[0].cryptos)


  //let query = await client.query(`SELECT cryptos FROM users WHERE users.name = 'teste'`)
  //console.log(query.rows[0].cryptos)

  client.release();
}

exe()