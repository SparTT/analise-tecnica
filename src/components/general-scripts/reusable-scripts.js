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

export function getCurrentFiat() {
  let vsFiat = document.cookie
  if (vsFiat.search('vsCurrency') > -1) {
    vsFiat = vsFiat.split('vsCurrency=')[1]
    vsFiat = vsFiat.split(';')[0]
    //console.log('vsFiat', vsFiat)
  } else {
    //console.log('cookie não encontrado')
    vsFiat = 'brl'
  }
  return vsFiat
}