import { getSession } from "next-auth/react"

const { MongoClient, ObjectId } = require("mongodb");

export default async (req, res) => {
  const session = await getSession({ req })

  if (session === null) return res.status(500).json({error: 'User not found'})

  const dbName = "users";
  const client = new MongoClient(process.env.DATABASE_URL);

  const db = client.db(dbName);
  const col = db.collection("data");

  //console.log(session.accessToken)

  //let query = await col.findOne({username: session.accessToken.username})
  let query = await col.findOne({_id: ObjectId(session.accessToken.id)})
  //console.log('query', query.rows)
  if(query === null) {
    res.status(404).json(query)
  } else {
    query = query.cryptos
    res.status(200).json(query)
  }
  await client.close()

}