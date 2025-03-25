import axios from 'axios'

const Api = axios.create({
    //default endpoint API
    baseURL: 'http://192.168.1.185:3000',
    withCredentials: true, // Pastikan ini ditambahkan

})

export default Api