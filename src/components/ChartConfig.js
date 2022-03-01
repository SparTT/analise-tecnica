export const Config = {
  plugins: {
    // show legends for our graph
    legend: {
      display: true,
    },
    tooltip: {
      mode: 'index'
    }
  },
  lineHeightAnnotation: {
    always: true,
    lineWeight: 1.5,
  },

//   animate in
  animation: {
    duration: 1,
  },
  maintainAspectRatio: true,
  responsive: true,

//   show the x and y scales
  scales: {
    x: { display: true },
    y: { display: true }, 
  },
  elements: {
    point: {
        radius: 1
    }
  },
};
