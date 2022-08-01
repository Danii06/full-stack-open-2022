import { useState } from 'react'

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 10 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.'
  ]
  const [selected, setSelected] = useState(0)
  const [votes, setVotes] = useState({})

  const addVote = (vote) => {
    let copy = { ...votes }
    if(vote in votes){
      copy[vote]+=1
    }else{
      copy[vote]=1
    }
    setVotes(copy)
  }

  const mostVotes = (votes) => {
    return Object.entries(votes).reduce(
      ([prevkey,prevval],[currkey,currval])=>{
        return (prevval<currval ? [currkey,currval] : [prevkey,prevval])
    },[0,0])
  }

  return (
    <div>
      <h2>Anecdote of the day</h2>
      <p>
      {anecdotes[selected]}
      </p>
      <p> has {selected in votes ? votes[selected] : 0} votes</p>
      <button onClick={() => {addVote(selected)}}>vote</button>
      <button onClick={() => setSelected(Math.floor(Math.random()*7))}>next anecdote</button>
      <h2>Anecdote with the most votes</h2>
      <p> {anecdotes[mostVotes(votes)[0]]} </p>
      <p> has {mostVotes(votes)[1]} votes</p>
    </div>
  )
}

export default App