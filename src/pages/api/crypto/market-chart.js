
export default async function handler (req, res) {


  const id = typeof req.query.id == 'undefined' ? 'dogecoin' : req.query.id
  const vs_currencies = typeof req.query.vs == 'undefined' ? 'brl' : req.query.vs


  let url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${vs_currencies}&ids=${id}&order=market_cap_desc&per_page=100&page=1&sparkline=false&price_change_percentage=1h,24h,7d,30d,200d,1y`

  url = `https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=${vs_currencies}&days=1`//&interval=hourly

  console.log(url)

  await fetch(url)
  .then(resp => resp.json())
  .then(resp => {
    //res.status(200).json({id: id, res: resp})
    if(resp.length === 0) return res.status(404).json({error: 'Não encontrado'})

    
    /*
    for(let dataType of Object.keys(resp)) {
      for(let val of resp[dataType]) {
        let dia = new Date(val[0])
        val[0] = dia.getDate()
      }
    }
    */
    


    res.status(200).json(resp)
  }).catch(error => {
    console.log(error)
  })

}