import axios from 'axios'

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_DAILY_DIET_API_URL,
})
