//import { useRouter } from 'next/router'
//import { useEffect } from 'react'
import CryptoChart from '../components/crypto/old-chart'


const Crypto = () => {


  //console.log('cryptoId', cryptoId)

  return (
    <div>
      <script src="https://d3js.org/d3.v7.min.js"></script>
      <CryptoChart name={'bitcoin'} vs_currency={'brl'} />
    </div>
  )

}

export default Crypto