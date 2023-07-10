import axios from 'axios'

export const api = axios.create({
  baseURL: '/api', // localhost não é necessário pois axios já identifica que o backend e o front estão no mesmo projeto
})
