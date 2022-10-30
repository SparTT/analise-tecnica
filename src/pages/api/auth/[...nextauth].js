import NextAuth from "next-auth"
import Credentials from 'next-auth/providers/credentials'
import { user } from "pg/lib/defaults";
const { Pool } = require('pg');

// https://next-auth.js.org/getting-started/example
// https://github.com/nextauthjs

const pool = new Pool({
  connectionString: process.env.DATABASE_URL, 
  ssl: {
    rejectUnauthorized: false
  }
});

async function validateUser(credentials) {


  console.log('validando user')

  const client = await pool.connect();
  // password = crypt( (%s), password )
  // crypt(%(password)s, gen_salt('bf'))

  const queryText = 'SELECT * FROM users WHERE name = $1'
  
  const query = {
    text: queryText,
    values:  [ credentials.username ]
  }

  const resp = await client.query(query)

  //console.log('rows', resp.rows)
        
  client.release()

  if(resp.rows.length > 0) {
    return resp.rows[0]
  } else {
    return null
  }

}

const providers = [
  Credentials({
    id: "domain-login",
    name: 'Credentials',
    session: {
      jwt: true,
      maxAge: 30 * 24 * 60 * 60
    },
    credentials: {
      username: { label: "Nome de Usuário", type: "text", placeholder: "username" },
      password: { label: "Senha", type: "password", placeholder: '********' },
    },
    authorize: async (credentials) => {
      console.log('cred', credentials)

      let user = await validateUser(credentials)
      
      //console.log('user', user)

      if(user === null) throw 'Usuário não encontrado'

      if (user) {
        return user
      } else {
        throw 'Usuário não encontrado'
      }
    }
  })
]

const callbacks = {
  // Getting the JWT token from API response
  
  async jwt(data) {

    const { token, user } = data

    //console.log('data', data)
    
    //console.log('jwt token', token)
    //console.log('jwt user', user)
    
    if (user) {
      //token.accessToken = user.token
      token.userData = user.cryptos
      console.log('passei aq')
    }
    
   
    return token
  },
  
  async session(data) {
    const { session, token } = data 
    //console.log('session sess', session)
    //console.log('session data', data)
    
    session.accessToken = token
    return session
  }

}

const options = {
  providers,
  callbacks
}

export default (req, res) => NextAuth(req, res, options)
//export default (req, res) => NextAuth(req, res)