import { parse } from "dotenv";
import { getSession } from "next-auth/react"
import { user } from "pg/lib/defaults";

const { MongoClient, ObjectId } = require("mongodb");

export default async function handler (req, res) {

  const session = await getSession({ req })
  const id = session.accessToken.id

  const parsedHeader = JSON.parse(req.headers.data)

  const { total_spent, qtd } = parsedHeader
  let { name } = parsedHeader
  name = name.toLowerCase()

  let findCrypto = await fetch(`${req.headers.origin}/api/crypto/get-crypto?id=${name}`).then(resp => resp.json())

  if(findCrypto.error) {

    findCrypto.msg = findCrypto.error === 'Could not find coin with the given id' ? `A crypto ${name} não foi encontrada` : findCrypto.error

    return res.status(500).json({error: findCrypto})
  }

  let data = {
    qtd: qtd,
    total_spent: total_spent,
    currency_spent: 'brl' // dynamic later
  }
  
  const client = new MongoClient(process.env.DATABASE_URL)

  const db = client.db('users')
  const col = db.collection("data")
  // const result = await col.replaceOne({ username: username }, cryptos);  

  const result = await col.findOneAndUpdate({ _id: new ObjectId(id) }, { $set: { ["cryptos." + name]:  data } }, { returnDocument: 'after' });  

  return res.status(200).json(result.value.cryptos)

}