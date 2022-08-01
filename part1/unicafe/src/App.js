import { useState } from 'react'

const StatisticLine = (props) => {
  return (
    <tr>
      <td>{props.name}</td>
      <td>{props.value()}</td>
    </tr>
  )
}

const Statistics = (props) => {
  if(props.statistics.reduce((sum,elem)=>sum+elem,0) === 0){
    return (<p>No feedback gathered</p>)
  }
  let [good,neutral,bad] = props.statistics
  return (
    <>
      <h2>Statistics</h2>
      <table>
      <StatisticLine name="Good" value={()=>{return good}} />
      <StatisticLine name="Neutral" value={()=>{return neutral}} />
      <StatisticLine name="Bad" value={()=>{return bad}} />
      <StatisticLine name="All" value={()=>{return good + neutral + bad}} />
      <StatisticLine name="Average" value={()=>{return good + neutral + bad}} />
      <StatisticLine name="Positive" value={()=>{return (good*100)/(good + neutral + bad) + " %"}} />
      </table>
    </>
  )
}

const Button = (props) => {
  return (<button onClick={() => { props.state[1](props.state[0] + 1) }}> {props.name} </button>)
}


const App = () => {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  return (
    <div>
      <h1>Rate your Unicafe experience</h1>
      <Button name="Good" state={[good, setGood]} />
      <Button name="Neutral" state={[neutral, setNeutral]} />
      <Button name="Bad" state={[bad, setBad]} />
      <Statistics statistics={[good, neutral, bad]} />
    </div>
  )
}

export default App