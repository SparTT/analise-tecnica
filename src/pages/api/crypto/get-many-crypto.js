
import { route } from 'next/dist/server/router';
//import { useRouter } from 'next/router'



export default async function handler (req, res) {

  const id = typeof req.query.id == 'undefined' ? 'dogecoin' : req.query.id
  const vs_currency = typeof req.query.fiat == 'undefined' ? 'brl' : req.query.fiat

  if(id === 'undefined') return res.status(500).json({error: 'id não declarado'})

  let url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${vs_currency}&ids=${id}&order=market_cap_desc
  &per_page=100&page=1&sparkline=false&price_change_percentage=1h,24h,7d,30d,1y`

  await fetch(url)
  .then(resp => {
    //console.log(resp.status, resp.statusText)
    return resp.json()
  })
  .then(resp => {

    if(resp.error) return res.status(404).json({error: resp.error})

    for(let i = 0; i < resp.length; i++) {
      let coin = resp[i]
      for(let j = 0; j < Object.keys(coin).length; j++) {
        if(Object.keys(coin)[j].includes('price_change_percentage')) {
          //console.log(Object.values(coin)[j])
          coin[Object.keys(coin)[j]] = Object.values(coin)[j] === null ? 0 : Number(Object.values(coin)[j].toFixed(2)) // + '%'
          //console.log(coin[Object.keys(coin)[j]])
        }
      }
    }

    res.status(200).json(resp)
  }).catch(error => {
    res.status(500).json(error)
  })

}