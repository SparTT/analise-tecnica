import React, { useState, useEffect } from 'react';
import ReactEcharts from 'echarts-for-react';
import { signIn } from "next-auth/react"

function prepareDonutData(data) {
  let res = []
  for(let el of data) {
    let coin = {
      name: el.id,
      value: el.user_fiat_amount
    }
    res.push(coin)
  }
  return res
}

export function Donut({ data }) {


  if(!data) return <div>carregando</div>

  if (!data[0].value) data = prepareDonutData(data)

  
  const chartOptions =  {
    tooltip: {
      trigger: 'item'
    },
    
    legend: {
      orient: 'vertical',
      left: 'left',
      textStyle: {
        color: 'white'
      }
    },
    title: {
      text: 'Your portfolio',
      left: 'center',
      textStyle: {
        color: 'white',
      },
    },
    series: [
      {
        name: 'Crypto: ',
        type: 'pie',
        radius: ['40%', '70%'],
        center: ['50%', '50%'],
        avoidLabelOverlap: true,
        itemStyle: {
          //color: '#c23531',
          shadowBlur: 200,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        },
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: false,
            fontSize: 40,
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: false
        },
        data: data
      }
    ]
  };
  

  const [ userData, setUserData ] = useState(null);

  return (
    <>
    <ReactEcharts
      option={chartOptions}
    />
    </>
  );
}
export default Donut;