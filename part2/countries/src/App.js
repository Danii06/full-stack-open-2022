import { useState, useEffect } from 'react'
import axios from 'axios'
import { openWeatherAPIKey as key } from './secrets'

const SearchBar = ({ updateSearch }) => {
  return (
    <>
      <input onChange={updateSearch} />
      <br />
    </>
  )
}

const List = ({ list }) => {
  return list.map((element) => <li key={element}>{element}</li>)
}

const ChooseList = ({ list, onClick }) => {
  return list.map((element) => <><li >{element}<button onClick={(e) => onClick(element)}>show</button></li></>)
}

const Weather = ({ data, temperature, setTemperature, wind, setWind, icon, setIcon }) => {
  const weatherURL = "https://api.openweathermap.org"

  //Get latitude and longitude
  axios.get(`${weatherURL}/geo/1.0/direct?q=${data[0].capital[0]}&limit=1&appid=${key}`)
    .then(function (response) {
      let [lat, lon] = [response.data[0].lat, response.data[0].lon]
      //Get weather at latitude and longitude
      return axios.get(`${weatherURL}/data/2.5/weather?lat=${lat}&lon=${lon}&units=Metric&appid=${key}`).then(
        function (response) {
          setTemperature(response.data.main.temp)
          setWind(response.data.wind.speed)
          setIcon("http://openweathermap.org/img/wn/"+response.data.weather[0].icon+"@2x.png")
        }
      )
    })

  return (<>
  <h2> Weather in {data[0].capital[0]} </h2>
  <p>temperature {temperature} Celcius</p>
  <img src={icon} />
  <p>wind {wind} m/s</p>
  </>)
}

const CountryData = ({ data }) => {
  const [temperature, setTemperature] = useState(<>Loading...</>);
  const [wind, setWind] = useState(<>Loading...</>);
  const [icon, setIcon] = useState("");

  return (<>
    <h1>{data[0].name.common}</h1>
    <p>capital {data[0].capital[0]}<br />
      area {data[0].area}
    </p>
    <p><b>languages</b>
      <List list={Object.values(data[0].languages)} />
    </p>
    <img src={data[0].flags.png} alt={data[0].name.common + " flag"} style={{ width: "100px" }} />
    <Weather data={data} temperature = {temperature} wind = {wind} icon = {icon} setIcon = {setIcon} setTemperature = {setTemperature} setWind = {setWind}/>
  </>)

}

const CountryList = ({ search, data, onClick }) => {

  if (search.length === 0) {
    return null
  }

  if (data.length > 10) {
    return "Too many matches, specify another filter"
  }

  if (data.length > 1) {
    return <ChooseList list={data.map((country) => country.name.common)} onClick={onClick} />
  }
}


function App() {
  const [search, setSearch] = useState("");
  const [data, setData] = useState([]);

  useEffect(() => {

    let delay = setTimeout(() => {
      axios.get(`https://restcountries.com/v3.1/name/${search}`).then(
        (response) => {
          setData(response.data)
        }
      ).catch(
        (e) => {
          setData([])
        }
      )
    }, 300)

    return () => clearTimeout(delay)

  }, [search])

  function updateSearch(e) {
    setSearch(e.target.value)
  }

  return [<SearchBar updateSearch={updateSearch} />,
  data.length!==1 ? 
  <CountryList search={search} data={data} onClick={(element) => setSearch(element)} /> 
  : <CountryData data={data} />];
}

export default App;
