import { useEffect } from 'react'
import React, { useState } from 'react';
import Script from 'next/script'
import { Children } from 'react/cjs/react.production.min';

//import marketChart from '../../pages/api/crypto/market-chart'

// https://medium.com/analytics-vidhya/how-to-make-interactive-line-chart-in-d3-js-4c5f2e6c0508

const OldChart = ({ name, vs_currency }) => {
  
  return (
    <div>
      K
      <div id="chart"></div>
      <script type="text/javascript" src='/scripts/client-side-chart.js'>
      </script>
    </div>
  )

}

export default OldChart