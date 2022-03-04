//  http://bl.ocks.org/WillTurman/4631136

async function getData(name, vs_currency) {

  if(!name) name = 'bitcoin'
  if(!vs_currency) vs_currency = 'brl'

  const data = await fetch(`/api/crypto/market-chart?id=${name}&vs_currency=${vs_currency}`).then(resp => resp.json())

  return data
}

function formatCurrency(number, currency, lang) {

  lang = typeof lang == 'undefined' ? 'pt-BR' : lang
  currency = typeof currency == 'undefined' ? 'BRL' : currency

  const res = new Intl.NumberFormat(lang, { style: 'currency', currency: currency }).format(number)
  return res
}


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

      
// tentativa de tooltip
let tooltipDiv = d3.select("body").append("div")
.attr("class", "tooltip")
.style("opacity", 0);
svg.selectAll("circle")
.data(data)
.enter().append("circle")
.style("stroke","transparent")
.style("stroke-width","35px")
//.style('visibility', 'hidden')
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
  .on("mouseover", function(event) {
    let item = event.path[0].__data__

    let day = new Date(item[0])
    day = formatDate(day)
    console.log(day)
    let price = formatCurrency(item[1])


    tooltipDiv.transition()
      .duration(200)
      .style("opacity", .9);
    tooltipDiv.html("Horário : " + day + "<br/> Preço : " + price)
      .style("left", (event.pageX) + "px")
      .style("top", (event.pageY - 28) + "px");
  })
  .on("mouseout", function() {
    tooltipDiv.transition()
      .duration(500)
      .style("opacity", 0);
  })


      
  var vertical = d3.select('#chart').append("div")
      .attr("class", "vertical")
      .style("position", "absolute")
      .style("z-index", "19")
      .style("width", "1px")
      .style("height", height + 'px')
      .style('margin-bottom', height + 'px')
      .style("top", "10px")
      .style("bottom", "30px")
      .style("left", "0px")
      .style("background", "black");

    svg.on("mousemove", function(event){  

       //mousex = d3.mouse(this);
       //mousex = mousex[0] + 5;
       
       mousex = event.pageX + 5

       vertical.style("left", mousex + "px" )})
    .on("mouseover", function(event){  
       //mousex = d3.mouse(this);
       //mousex = mousex[0] + 5;
       mousex = event.pageX + 5
       vertical.style("left", mousex + "px")});

  return svg.node();
  //return svg
}



console.log(chart)

getData()
.then( resp => {
  console.log(resp)
  const prices = resp.prices
  let chart = LineChart(prices, {
    x: prices => prices[0], 
    y: prices => prices[1],
    /*height: 800,
    width: 1000*/
  })

  console.log(chart)
  document.querySelector('#chart').append(chart)
})


/*

-> função que irá reconhecer p/ lado q foi mandado verticalLine
-> função que irá mandar pro circle mais proximo do lado que foi mandado


*/