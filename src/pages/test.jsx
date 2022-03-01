import CryptoChart from '../components/crypto/chart'
import OldChart from '../components/crypto/old-chart'
import { useEffect } from 'react'



const Home = () => {
  
  //useEffect(() => socketInitializer(), [])
  /*
  
      <div>
      <h1>Funfou</h1>
      <h3 id="last-number"></h3>
    </div>
  */ 

  /*
    d3
      <CryptoChart name={'bitcoin'} vs_currency={'brl'} ></CryptoChart>
  */
  return (
    <div className='chart-container'>
      <script src="https://d3js.org/d3.v7.min.js"></script>
      <OldChart name={'bitcoin'} vs_currency={'brl'} ></OldChart>


    </div>

  )
}

export default Home;