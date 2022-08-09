import axios from 'axios'

const getIdFromName = (name, persons) => persons.filter((p)=>p.name===name)[0].id

const getAll = () => {
    return axios.get("http://localhost:3001/persons").then((response) => response.data)
}

const post = (data) => {
    return axios.post("http://localhost:3001/persons",data).then(response=>response.data)
}

const put = (data, name, persons) => {
    return axios.put(`http://localhost:3001/persons/${getIdFromName(name, persons)}`,data).then(response=>response.data)
}

const deleteEntry = (name, persons) => {
    return axios.delete(`http://localhost:3001/persons/${getIdFromName(name, persons)}`).then(response=>response.data)
}

const exportdict = {getAll, post, delete: deleteEntry, put}
export default exportdict;