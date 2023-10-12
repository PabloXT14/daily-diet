import axios from 'axios'

export const api = axios.create({
  baseURL: process.env.DAILY_DIET_API_URL,
})
