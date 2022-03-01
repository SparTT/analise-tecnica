import { useEffect } from 'react'
import React, { useState } from 'react';
import { Children } from 'react/cjs/react.production.min';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js/auto'
import { Chart } from 'react-chartjs-2'

import { Config } from '../ChartConfig';
//import marketChart from '../../pages/api/crypto/market-chart'


// https://www.learnnext.blog/blogs/using-chartjs-in-your-nextjs-application
//https://medium.com/analytics-vidhya/how-to-make-interactive-line-chart-in-d3-js-4c5f2e6c0508

function formatDate(date) {
  let dd = date.getDate();
  let mm = date.getMonth() + 1;
  let hh = date.getHours()//-3
  let min = date.getMinutes()
  let ss = date.getSeconds()
  
  let yyyy = date.getFullYear();
  dd = dd < 10 ? '0' + dd : dd 
  mm = mm < 10 ? '0' + mm : mm 
  
  hh = hh < 10 ? '0' + hh : hh 
  min = min < 10 ? '0' + min : min 
  ss = ss < 10 ? '0' + ss : ss 

  //let res = `${dd}/${mm}/${yyyy} ${hh}:${min}:${ss}`;
  let res = `${hh}:${min}`;
  return res
}


const CryptoChart = ({ name, vs_currency }) => {
  

  const[ reactData, setReactData ] = useState(null);
  
  useEffect(async () => {
    //let res = await marketChart({query: {id: name, vs_currency: vs_currency}})

    const res = await fetch(`/api/crypto/market-chart?id=${name}&vs_currency=${vs_currency}`).then(resp => resp.json()).catch(err => err)
    console.log(res)
    setReactData(res)
   }, [])

  if(reactData === null) return <div>Carregando</div>
  if(reactData.error) return <div>Erro ao carregar gráfico</div>
  if(reactData.errno) return <div>Erro ao carregar gráfico</div>

  //console.log(reactData.prices)
  // maybe create a 404 template?
  //if(reactData.error) return <div>{reactData.status} {reactData.error}</div>

  let prices = reactData.prices
  const label = prices.map(el => {
    
    let res = el[0]
    res = new Date(res)
    res = formatDate(res)
    return res
  }) // x
  const data = prices.map(el => el[1]) // y

  const chartData = {
    labels: label,
    datasets: [{
      label: name,
      data: data,
      fill: false,
      borderColor: ' #0052ff',
      tension: 0.1,
      // partially transparent part below our line graph
      backgroundColor: 'rgba(59, 130, 246, 0.2)',
      borderWidth: 3,
      borderCapStyle: 'butt',
      //pointRadius: props.pointRadius,
      pointHoverRadius: 7,
      pointHoverBackgroundColor: 'rgba(59, 130, 246, 1)',
      pointHoverBorderColor: 'rgba(59, 130, 246, 1)',
      pointHoverBorderWidth: 2
    }]
  }


  return (
    <div>
      <Line data={chartData}  options={Config}/>
    </div>
  )

}

export default CryptoChart