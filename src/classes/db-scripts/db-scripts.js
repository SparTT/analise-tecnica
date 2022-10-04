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


async function tipoConta() {
  
  const client = await pool.connect();
  //await client.query('DROP TABLE users')
  // product_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  // product_id SERIAL PRIMARY KEY,
  // criar outra tabela com os tipos de conta e chamar ela pelo ID ?
  // SET timezone = 'America/Sao_Paulo';
  
  const createTipoContaTable = `
  CREATE TABLE IF NOT EXISTS tipo_conta (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
  );
  `

  await client.query(createTipoContaTable)


  const insertTipoConta = 'INSERT INTO tipo_conta(name) VALUES ($1);'
  const addTipoConta = {
    text: insertTipoConta,
    values: ['dominio']
  }
  await client.query(addTipoConta, (err, res) => {
    if (err) throw err;
  })

  let query = await client.query('SELECT * FROM tipo_conta')
  console.log(query.rows)

  client.release();
}



async function exe() {
    

  const client = await pool.connect();

  //await client.query('DROP TABLE users')
  const createUsersTable = `
  CREATE EXTENSION IF NOT EXISTS "pgcrypto";
  CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR (16),
    password VARCHAR (72),
    email TEXT,
    tipo_conta INT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    cryptos JSONB
  );
  `



  //await client.query(createUsersTable)


  await client.query(`DELETE FROM users WHERE users.name = 'teste' `)

  //db_cursor.execute("SELECT * FROM users WHERE users.username = (%s) AND password = crypt( (%s), password )", (user['username'], user['password']))

  const insertText = `INSERT INTO users(name, email, password, tipo_conta, cryptos) VALUES ($1, $2, crypt($3, gen_salt('bf')), $4, $5);`

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

  const sendData = {
    text: insertText,
    values: ['teste', 'testeasdadsa2@gmail.com', '123' ,'1', cryptos]
  }
  

  await client.query(sendData, (err, res) => {
    if (err) throw err;
  })



  let query = await client.query('SELECT * FROM users')
  console.log(query.rows)

  client.release();
}

exe()