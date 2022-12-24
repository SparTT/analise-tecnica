import React, { useState, useEffect } from 'react';
import ReactEcharts from 'echarts-for-react';
import { signIn } from "next-auth/react"

import { roundToNearestNumber } from '../general-scripts/reusable-scripts';

export function LineChart({ vsCurrency, externalData, data }) {

  const [ userData, setUserData ] = useState(data ? data : null);
  const [ isExternalData, setIsExternalData ] = useState(!externalData ? false : true)

  if(!isExternalData) {
    useEffect( () => {
      async function fetchUserData() {
        let userVal = await fetch('/api/user/daily-value')
          .then(resp => resp.json())
          .then(async resp => {
            if (resp === null) {
              console.log('erro ao carregar os dados')
              return null
            } else {
              console.log('had sess req')
              return resp
            }
          })
          setUserData(userVal)
      }
      fetchUserData()
    }, [])
  }

  // criar loading bonitinho (ou um load shimmer)
  if (!userData) return <div>Carregando</div>

  //console.log(userData, isExternalData)

  let xArr = Object.values(userData).map((el) => el.day)
  let userValue = Object.values(userData).map((el) => el[vsCurrency].total)

  let smallestVal = Math.min.apply(null, userValue) * 0.99
  //console.log(smallestVal)

  smallestVal = roundToNearestNumber(smallestVal, 500)
  return (
    <>
    <ReactEcharts
      option={{
        xAxis: {
          type: 'category',
          data: xArr,
          axisLine: {
            lineStyle: {
              //color: '#a19f9f',
              color: '#666666'
            }
          },
          splitLine: {
            show: false,
          },
        },
        title: {
          text: 'Daily value',
          /*left: 'center',*/
          textStyle: {
            color: 'white',
          },
        },
        yAxis: {
          type: 'value',
          min: smallestVal,
          minInterval: 500,
          //max: highestVal,
          axisLine: {
            lineStyle: {
              color: '#666666'
            }
          },
          splitLine: {
            //show: false,
            lineStyle: {
              color: '#666666',
              type: 'dashed'
            }
          }
        },
        tooltip: {
          trigger: 'axis'
        },
        series: [{ 
          data: userValue,
          type: 'line',
          symbol: 'none',
          itemStyle: {
            color: '#6639e4'
          },
        }]
      }}
    />
    </>
  );
}
export default LineChart;