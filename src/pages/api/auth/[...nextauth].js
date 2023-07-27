import NextAuth from "next-auth"
import Credentials from 'next-auth/providers/credentials'
const ObjectId = require('mongodb').ObjectId;

import { validateUser } from "../../../components/utils/validateUser";

// https://next-auth.js.org/getting-started/example
// https://github.com/nextauthjs


const providers = [
  Credentials({
    id: "domain-login",
    name: 'Credentials',
    session: {
      jwt: true,
      maxAge: 7 * 24 * 60 * 60 // expire in 7 days (?)
    },
    credentials: {
      username: { label: "Nome de Usuário", type: "text", placeholder: "username" },
      password: { label: "Senha", type: "password", placeholder: '********' },
    },
    authorize: async (credentials) => {
      console.log('cred', credentials)

      let user = await validateUser(credentials, true)

      //console.log('user', user)

      if (user === null) throw new Error('Usuário não encontrado')

      if (user.error) throw new Error(user.error)

      return user
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
      token.name = user.name
      token.username = user.username
      token.email = user.email
      token.id = user._id
      //console.log('passei aq')
    }
    
   
    return token
  },
  
  async session(data) {
    const { session, token } = data 
    //console.log('session sess', session)
    //console.log('session data', data)
    
    session.accessToken = token
    session.accessToken.name = token.name
    session.accessToken.username = token.username
    session.accessToken.email = token.email
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