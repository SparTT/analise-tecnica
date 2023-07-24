const { MongoClient } = require("mongodb");
const bcrypt = require("bcrypt")


async function comparePassword(password, hash) {
  let res = bcrypt
    .compare(password, hash)
    .then(res => {
      console.log(res) // return true
      return res
    })
    .catch(err => console.error(err.message))

  return res
}

export async function validateUser(credentials, checkPass) {


  console.log('validando user', checkPass)
  //console.log('credent', credentials)

  checkPass = !checkPass ? false : checkPass


  const dbName = "users";
  const client = new MongoClient(process.env.MONGODB_URI);

  const db = client.db(dbName);

  const col = db.collection("data");

  //let validator = credentials.email || credentials.username

  const resp = await col.findOne({ username: credentials.username });

  console.log('rowss', resp)

  await client.close();

  if (checkPass === true && resp?.password) {
    let validatePass = await comparePassword(credentials.password, resp.password)

    if (validatePass === false) return { error: 'Senha incorreta' }

  }
  
  return resp

}