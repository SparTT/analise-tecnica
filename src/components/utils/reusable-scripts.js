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

export function getCookie(cookie, param, defaultReturn) { 

  let res

  if (typeof cookie === 'undefined') return defaultReturn

  if (cookie.search(param) > -1) {
    res = cookie.split(`${param}=`)[1]
    res = res.split(';')[0]
    console.log(param, res)
    //res = res === 'false' ? false : true
  } else {
    console.log(param, 'não encontrado')
    res = defaultReturn
  }

  return res

}

export function formatStrDate(dia, usaHoras) {
    
  if(dia === null) return null

  let day, month, year
  day = dia.getDate()
  month = dia.getMonth() + 1
  year = dia.getFullYear()

  day = day < 10 ? '0' + day : day
  month = month < 10 ? '0' + month : month

  let specificTiming = ''
  if (usaHoras) {
    let hour, min, sec

    hour = dia.getHours()
    min = dia.getMinutes()
    sec = dia.getSeconds()

    hour = hour < 10 ? '0' + hour : hour
    min = min < 10 ? '0' + min : min
    sec = sec < 10 ? '0' + sec : sec

    specificTiming = ` - ${hour}:${min}:${sec}`

  }
    
  return `${day}/${month}/${year}${specificTiming}`

}


export function roundToNearestNumber(num, rounder) {
  return Math.round(num / rounder) * rounder;
}

export const Loading = () => {
  return <div className="loading-content">Loading</div>
}