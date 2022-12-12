import NextAuth from "next-auth"
import Credentials from 'next-auth/providers/credentials'
import { user } from "pg/lib/defaults";
const ObjectId = require('mongodb').ObjectId;


const { MongoClient } = require("mongodb");

// https://next-auth.js.org/getting-started/example
// https://github.com/nextauthjs


async function validateUser(credentials) {


  console.log('validando user')


  const dbName = "users";
  const client = new MongoClient(process.env.DATABASE_URL);

  const db = client.db(dbName);

  const col = db.collection("data");

  const resp = await col.findOne({username: credentials.username});

  //console.log('rows', resp.rows)
        
  await client.close();

  return resp

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
      token.username = user.username
      token.id = user._id
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
    session.accessToken.username = token.username
    session.accessToken.id = new ObjectId(token.id)
    return session
  }

}

const options = {
  providers,
  callbacks
}

export default (req, res) => NextAuth(req, res, options)
//export default (req, res) => NextAuth(req, res)