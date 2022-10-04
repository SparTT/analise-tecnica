
import { route } from 'next/dist/server/router';
//import { useRouter } from 'next/router'

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


export default async function handler (req, res) {

  if(typeof req.query.name == 'undefined' ) return res.status(500).json({ error : 'nenhum valor inserido' })

  const name = req.query.name

  await fetch(`https://api.coingecko.com/api/v3/search?query=${name}`)
  .then(resp => {
    //console.log(resp.status, resp.statusText)
    return resp.json()
  })
  .then(resp => {
    //console.log(resp)

    if(resp.error) return res.status(404).json({error: resp.error})

    let data = []

    for(let i = 0; i < 5; i++) {
      if(typeof resp.coins[i] != 'undefined') data.push(resp.coins[i])
    }

    res.status(200).json(data)
  }).catch(error => {
    res.status(500).json(error)
  })

}