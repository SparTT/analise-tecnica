
import { route } from 'next/dist/server/router';
//import { useRouter } from 'next/router'

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


export default async function handler (req, res) {

  const id = typeof req.query.id == 'undefined' ? 'dogecoin' : req.query.id
  const vs_currencies = typeof req.query.vs == 'undefined' ? 'brl' : req.query.vs

  if(id === 'undefined') return res.status(500).json({error: 'id não declarado'})

  let url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${vs_currencies}&ids=${id}&order=market_cap_desc&per_page=100&page=1&sparkline=false&price_change_percentage=1h,24h,7d,30d,200d,1y`

  url = `https://api.coingecko.com/api/v3/coins/${id}`


  await fetch(url)
  .then(resp => {
    //console.log(resp.status, resp.statusText)
    return resp.json()
  })
  .then(resp => {

    if(resp.error) return res.status(404).json({error: resp.error})

    res.status(200).json(resp)
  }).catch(error => {
    res.status(500).json(error)
  })

}