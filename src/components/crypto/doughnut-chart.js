import React, { useState, useEffect } from 'react';
import ReactEcharts from 'echarts-for-react';
import { signIn } from "next-auth/react"
import { Loading } from '../general-scripts/reusable-scripts';

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


  if(!data) return <Loading />

  if (!data[0].value) data = prepareDonutData(data)


  const [needsTop, setNeedsTop ] = useState(null)


    
  let chartOptions =  {
    tooltip: {
      trigger: 'item'
    },
    
    legend: {
      orient: 'horizontal',
      left: 'center',
      textStyle: {
        color: 'white'
      },
      top: '10%',
    },
    title: {
      text: 'Your portfolio',
      left: 'center',
      textStyle: {
        color: 'white',
      },
      top: '0%',
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
        data: data,
        top: '20%'
      }
    ]
  };


  
  useEffect(() => {

    window.addEventListener('resize', () => {
      let type = document.body.clientWidth > 1300 ? '0%' : '20%'
      if (type !== needsTop) setNeedsTop(type)

      document.body.clientWidth > 1300 ? setNeedsTop('0%') : setNeedsTop('20%')
      document.body.clientWidth < 1100 ? setNeedsTop('20%') : setNeedsTop('40%')
      document.body.clientWidth < 800 ? setNeedsTop('0%') : setNeedsTop('40%')
  
      if(document.body.clientWidth < 600) {
        setNeedsTop('0%')
        chartOptions.legend.left = 'center'
        chartOptions.legend.orient = 'horizontal'
      }
      console.log(chartOptions.legend)
    }) 
    
    document.body.clientWidth > 1300 ? setNeedsTop('0%') : setNeedsTop('20%')

    if (document.body.clientWidth < 1100) {
      setNeedsTop('20%') 
      document.body.clientWidth < 800 ? setNeedsTop('0%') : setNeedsTop('40%')
    }    

    if (document.body.clientWidth < 600) {
      setNeedsTop('0%')
      chartOptions.legend.left = 'center'
      chartOptions.legend.orient = 'horizontal'
    }
   // document.body.clientWidth < 800 ? setNeedsTop('40%') : setNeedsTop('50%')

  }, [])

  //chartOptions.series[0].top = needsTop

  console.log(chartOptions.series[0].top)

  return (
    <>
    <ReactEcharts
      option={chartOptions}
    />
    </>
  );
}
export default Donut;