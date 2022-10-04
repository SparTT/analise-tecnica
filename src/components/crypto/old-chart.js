import { useEffect } from 'react'
import React, { useState } from 'react';
import { Children } from 'react/cjs/react.production.min';

//import marketChart from '../../pages/api/crypto/market-chart'

function LineChart(data, {
  x = ([x]) => x, // given d in data, returns the (temporal) x-value
  y = ([, y]) => y, // given d in data, returns the (quantitative) y-value
  defined, // for gaps in data
  curve = d3.curveLinear, // method of interpolation between points
  marginTop = 20, // top margin, in pixels
  marginRight = 30, // right margin, in pixels
  marginBottom = 30, // bottom margin, in pixels
  marginLeft = 60, // left margin, in pixels
  width = 640, // outer width, in pixels
  height = 400, // outer height, in pixels
  xType = d3.scaleUtc, // the x-scale type
  xDomain, // [xmin, xmax]
  xRange = [marginLeft, width - marginRight], // [left, right]
  yType = d3.scaleLinear, // the y-scale type
  yDomain, // [ymin, ymax]
  yRange = [height - marginBottom, marginTop], // [bottom, top]
  yFormat, // a format specifier string for the y-axis
  yLabel, // a label for the y-axis
  color = "currentColor", // stroke color of line
  strokeLinecap = "round", // stroke line cap of the line
  strokeLinejoin = "round", // stroke line join of the line
  strokeWidth = 1.5, // stroke width of line, in pixels
  strokeOpacity = 1, // stroke opacity of line
} = {}) {
  // Compute values.
  const X = d3.map(data, x);
  const Y = d3.map(data, y);
  const I = d3.range(X.length);
  if (defined === undefined) defined = (d, i) => !isNaN(X[i]) && !isNaN(Y[i]);
  const D = d3.map(data, defined);


  // valor minimo pra Ydomain
  let minPrice = Math.min.apply(null, Y) * 0.995 // reduzir 0.5% do menor valor
  let maxYDomain = d3.max(Y) * 1.005 // aumentando 0.5% do maior valor
  //let maxYDomain = d3.max(Y) * 1.005 // aumentando 0.5% do maior valor
  console.log('minPrice', minPrice)

  // Compute default domains.
  if (xDomain === undefined) xDomain = d3.extent(X);
  if (yDomain === undefined) yDomain = [minPrice, maxYDomain];

  // Construct scales and axes.
  const xScale = xType(xDomain, xRange);
  const yScale = yType(yDomain, yRange);
  const xAxis = d3.axisBottom(xScale).ticks(width / 80).tickSizeOuter(0);
  const yAxis = d3.axisLeft(yScale).ticks(height / 40, yFormat);

  // Construct a line generator.
  const line = d3.line()
      .defined(i => D[i])
      .curve(curve)
      .x(i => xScale(X[i]))
      .y(i => yScale(Y[i]))

  const svg = d3.create("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [0, 0, width, height])
      .attr("style", "max-width: 100%; height: auto; height: intrinsic;")
      .on('mouseover', () => console.log('y'))

  svg.append("g")
      .attr("transform", `translate(0,${height - marginBottom})`)
      .call(xAxis);

  svg.append("g")
      .attr("transform", `translate(${marginLeft},0)`)
      .call(yAxis)
      .call(g => g.select(".domain").remove())
      .call(g => g.selectAll(".tick line").clone()
          .attr("x2", width - marginLeft - marginRight)
          .attr("stroke-opacity", 0.1))
      .call(g => g.append("text")
          .attr("x", -marginLeft)
          .attr("y", 10)
          .attr("fill", "currentColor")
          .attr("text-anchor", "start")
          .text(yLabel));

  svg.append("path")
      .attr("fill", "none")
      .attr("stroke", color)
      .attr("stroke-width", strokeWidth)
      .attr("stroke-linecap", strokeLinecap)
      .attr("stroke-linejoin", strokeLinejoin)
      .attr("stroke-opacity", strokeOpacity)
      .attr("d", line(I));


  // tentativa de tolltip
  let tooltipDiv = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

    console.log('x')
    svg.selectAll("circle")
    .data(data)
    .enter().append("circle")
    .style("stroke","transparent")
    .style("stroke-width","35px")
    .style("fill", '#00688B')
      .attr("r", 5)
      .attr("cx", function(obj) {
        let dataScale = obj[0]
        return xScale(dataScale);
      })
      .attr("cy", function(obj) {
        let dataScale = obj[1]
        return yScale(dataScale);
      })
      .on("mouseover", function(obj) {
        console.log(d3.event.pageX)
        tooltipDiv.transition()
          .duration(200)
          .style("opacity", .9);
        tooltipDiv.html("Time : " + obj[0] + "<br/>Price : " + obj[1])
          .style("left", (d3.event.pageX) + "px")
          .style("top", (d3.event.pageY - 28) + "px");
      })
      .on("mouseout", function(obj) {
        tooltipDiv.transition()
          .duration(500)
          .style("opacity", 0);
      })
  
  console.log(d3.select('#chart'))

  return svg.node();
  //return svg
}

// https://medium.com/analytics-vidhya/how-to-make-interactive-line-chart-in-d3-js-4c5f2e6c0508

const OldChart = ({ name, vs_currency }) => {
  

  const[ reactData, setReactData ] = useState(null);
  
  
  useEffect(async () => {
    console.log()
    //let res = await marketChart({query: {id: name, vs_currency: vs_currency}})
    
    let res = await fetch(`/api/crypto/market-chart?id=${name}&vs_currency=${vs_currency}`).then(resp => resp.json())
    console.log(res)
    setReactData(res)
   }, [])

  if(reactData === null) return <div>Carregando</div>

  console.log(reactData.prices)
  // maybe create a 404 template?
  //if(reactData.error) return <div>{reactData.status} {reactData.error}</div>

  let prices = reactData.prices
  let a = prices.filter(el => {
    return el[1]
  })
  console.log(a)
  
  /*
  prices = [    
  [1, 5],
  [2, 10],
  [3, 15],
  [4, 5],
  [5, 25],
  [6, 30]
  ]
  */
  
  let chart = LineChart(prices, {
    x: prices => prices[0], 
    y: prices => prices[1],
    height: 800,
    width: 1000
  })
  console.log(chart)

  return (
    <div>
      K
      <div id="chart" dangerouslySetInnerHTML={{__html: chart.outerHTML}}></div>
    </div>
  )

}

export default OldChart