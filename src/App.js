import './App.css'
import { useState } from "react"
import ShowHighestVolume from "./components/ShowHighestVolume"
import ShowLongestDownTrend from "./components/ShowLongestDownTrend"
import ShowMaxProfitWindow from "./components/ShowMaxProfitWindow"
import InputForm from './components/InputForm'
import { maximalprofitwindow, longestdowntrend, hourstodays, biggestvolume } from './modules/DataRefineing'


function App() {
  
  const [volume, setVolume] = useState(0);
  const [downTrendRecord, setDownTrendRecord] = useState(0);
  const [maximalProfit, setMaximalProfit] = useState(false);

  async function fetchData1(startDate,endDate,e) {

    const startunixtime = ((Date.parse(startDate))/1000)
    const endunixtime = ((Date.parse(endDate))/1000)+3600 
    // Tee tähä error handling 
    const res = await fetch("https://api.coingecko.com/api/v3/coins/bitcoin/market_chart/range?vs_currency=eur&from="+startunixtime+"&to="+endunixtime)
    var dataset = await res.json()     

    var daycount = (Math.abs(endunixtime*1000-startunixtime*1000)/86400000)
    if (daycount <= 90){
      dataset = hourstodays(dataset)
    }
    
    setDownTrendRecord(longestdowntrend(dataset))
    setVolume(biggestvolume(dataset))
    setMaximalProfit(maximalprofitwindow(dataset))
  }

  
  return (
    
    <div className="container"> 
      <InputForm func={fetchData1} />
      <ShowLongestDownTrend downTrendRecord={downTrendRecord}/>
      <ShowHighestVolume volume={volume}/>
      <ShowMaxProfitWindow maximalProfit={maximalProfit}/>
    </div>
    
  )
}

export default App;
