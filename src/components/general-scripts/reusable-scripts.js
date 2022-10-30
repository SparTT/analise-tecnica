export const fetcher = (...args) => fetch(...args).then(res => res.json())


export function formatCurrency(number, currency) {

  
  currency = typeof currency == 'undefined' ? 'BRL' : currency

  let lang
  switch (currency.toLowerCase()) {
    case 'brl':
      lang = 'pt-BR'
      break;
    case 'usd':
      lang = 'en-US'
      break;
    default:
      lang = 'pt-BR'
      break;
  }
 
  let res

  if (number > 0.10) {
    res = new Intl.NumberFormat(lang, { style: 'currency', currency: currency }).format(number)
  } else {
    res = new Intl.NumberFormat(lang, { style: 'currency', currency: currency, maximumSignificantDigits: 4 }).format(number) 
  }
  return res

}


export function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
export function prepareMultCrypto(resp) {

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

  return resp
}