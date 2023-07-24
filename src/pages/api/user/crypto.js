const { MongoClient, ObjectId } = require("mongodb");
import { getSession } from "next-auth/react"

export default async function handler(req, res) {


  const { method, body, query } = req;

	//const session = await getServerSession({ req, res, AuthOptions })
	//console.log(session)
  //const id = session.accessToken.id
	const session = await getSession({ req })
	console.log(session)
	const id = session?.accessToken ? session.accessToken.id : body.userId 

	if(method === 'GET') return res.status(200).json(id)

  const dbName = "users";
  const client = new MongoClient(process.env.MONGODB_URI);

  const db = client.db(dbName);
	const col = db.collection("data");

	const name = body.name

	/*
	let findCrypto = await fetch(`${req.headers.origin}/api/crypto/get-crypto?id=${name}`).then(resp => resp.json())

  if(findCrypto.error) {

    findCrypto.msg = findCrypto.error === 'Could not find coin with the given id' ? `A crypto ${name} não foi encontrada` : findCrypto.error

    return res.status(500).json(findCrypto)
  }
	*/


	let data = {
    qtd: body.cryptoAmount,
    total_spent: body.amountSpent,
		name: body.name,
    currency_spent: 'brl' // dynamic later
  }

	console.log(data)


  //if (method !== "GET") res.status(400).json({ error: "Method not allowed" })

	let result
  switch (method) {
    case 'POST': 
      result = await col.findOneAndUpdate({ _id: new ObjectId(id) }, { $set: { ["cryptos." + name]:  data } }, { returnDocument: 'after' }); 
			break
    case 'PUT':
			result = await col.findOneAndUpdate({ _id: new ObjectId(id) }, { $set: { ["cryptos." + name]:  data } }, { returnDocument: 'after' }); 
			break
		case 'DELETE':
			result = await col.findOneAndUpdate({ _id: new ObjectId(id) }, { $unset: { ["cryptos." + name]:  1 } }, { returnDocument: 'after' }); 
			break
  }

	return res.status(200).json(result.value.cryptos)





}