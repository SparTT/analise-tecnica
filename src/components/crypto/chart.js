import React, { useState, useEffect } from 'react';
import ReactEcharts from 'echarts-for-react';
import { signIn } from "next-auth/react"


function roundToNearestNumber(num, rounder) {
  return Math.round(num / rounder) * rounder;
}

export function Chart({session, vsCurrency}) {

  const [ userData, setUserData ] = useState(null);

  useEffect( () => {
    if (session) {
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


      console.time('get-data')
    } else {
      signIn()
    }
    
  }, [])

  if (!userData) return <div className="container">Carregando</div>

  console.log(userData)

  let xArr = Object.values(userData).map((el) => el.day)
  //console.log(xArr)
  let userValue = Object.values(userData).map((el) => el[vsCurrency].total)
  //console.log(userValue)

  let smallestVal = Math.min.apply(null, userValue) * 0.99
  console.log(smallestVal)

  smallestVal = roundToNearestNumber(smallestVal, 500)
  //highestVal = roundNearest100(highestVal)

  return (
    <>
    <h2>Daily Price</h2>
    <ReactEcharts
      option={{
        xAxis: {
          type: 'category',
          data: xArr
        },
        yAxis: {
          type: 'value',
          min: smallestVal,
          //max: highestVal
        },
        tooltip: {
          trigger: 'axis'
        },
        series: [{ 
          data: userValue,
          type: 'line'
        }]
      }}
    />
    </>
  );
}
export default Chart;