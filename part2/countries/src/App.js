import { useState, useEffect } from 'react'
import axios from 'axios'

const SearchBar = ({updateSearch}) => {
  return (
    <>
    <input onChange={updateSearch} />
    <br />
    </>
  )
}

const List = ({list}) => {
  return list.map((element) => <li>{element}</li>)
}

const ChooseList = ({list, onClick}) => {
  return list.map((element) => <><li>{element}<button onClick={(e)=>onClick(element)}>show</button></li></>)
}

const CountryData = ({data}) => {
  return (<>
      <h1>{data[0].name.common}</h1>
      <p>capital {data[0].capital[0]}<br />
      area {data[0].area}
      </p>
      <p><b>languages</b>
      <List list={Object.values(data[0].languages)} />
      </p>
      <img src={data[0].flags.png} alt={data[0].name.common + " flag"} style={{width: "100px"}}/>
    </>)
  
}

const CountryList = ({search, data, onClick}) => {

  if(search.length===0){
    return null
  }

  if(data.length>10){
    return "Too many matches, specify another filter"
  }

  if(data.length>1){
    return <ChooseList list={data.map((country) => country.name.common)} onClick={onClick}/>
  }

  if(data.length===1){
    return (
      <CountryData data={data}/>
    )
  }
}


function App() {
  const [search, setSearch] = useState("");
  const [data,setData] = useState([]);

  useEffect(()=>{
    axios.get(`https://restcountries.com/v3.1/name/${search}`).then(
      (response) => {
        setData(response.data)
      }  
    ).catch(
      (e)=>{
        setData([])
      }
    )
  },[search])

  function updateSearch(e){
    setSearch(e.target.value)
  }

  return (
    <>
      <SearchBar updateSearch={updateSearch}/>
      <CountryList search={search} data={data} onClick={(element)=>setSearch(element)}/>
    </>
  );
}

export default App;
