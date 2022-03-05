export const fetcher = (...args) => fetch(...args).then(res => res.json())


export function formatCurrency(number, currency, lang) {

  lang = typeof lang == 'undefined' ? 'pt-BR' : lang
  currency = typeof currency == 'undefined' ? 'BRL' : currency

  const res = new Intl.NumberFormat(lang, { style: 'currency', currency: currency }).format(number)
  return res
}

