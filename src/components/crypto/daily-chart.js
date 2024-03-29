import React, { useState, useEffect } from 'react';
import ReactEcharts from 'echarts-for-react';
import { signIn } from "next-auth/react"
import { graphic } from 'echarts'

import { roundToNearestNumber, Loading } from '../utils/reusable-scripts';

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
  if (!userData) return <Loading />

  //console.log(userData, isExternalData)

  let xArr = Object.values(userData).map((el) => el.day)
  let userValue = Object.values(userData).map((el) => el[vsCurrency].total)

  let smallestVal = Math.min.apply(null, userValue) * 0.99
  //console.log(smallestVal)

  let chartGap
  
  switch (vsCurrency) {
    case 'brl':
      chartGap = 500
      break;
    default:
      chartGap = 150
      break;
  }

  smallestVal = roundToNearestNumber(smallestVal, 500)
  return (
    <>
    <div className="overflow-scroll lg:overflow-hidden">
      <div className="min-w-[450px]">
        <ReactEcharts
        option={{
          xAxis: {
            type: 'category',
            data: xArr,
            boundaryGap: false,
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
            show: false
          },
          yAxis: {
            type: 'value',
            min: smallestVal,
            minInterval: chartGap,
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
            smooth: 0.6,
            itemStyle: {
              color: '#6639e4'
            },
            areaStyle: {
              color: new graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: '#6639e4db'
                },
                {
                  offset: 1,
                  color: '#6639e452'
                }])
            }
          }]
        }}
      />
      </div>
    </div>
    </>
  );
}
export default LineChart;