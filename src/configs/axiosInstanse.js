import axios from 'axios'

const BASE_URL = 'https://7ac5a3df9a7e5d25.mokky.dev'

export const axiosInstance = axios.create({
   baseURL: BASE_URL,

   headers: {
      'Content-Type': 'application/json',
   },
})

let customStore

export const injectStore = (store) => {
   customStore = store
}

axiosInstance.interceptors.request.use(
   (config) => {
      const { token } = customStore.getState()?.auth

      if (token) {
         config.headers.Authorization = `Bearer ${token}`
      }

      return config
   },

   (error) => {
      return Promise.reject(error)
   }
)

axiosInstance.interceptors.response.use(
   (response) => {
      return Promise.resolve(response)
   },

   (error) => {
      if (error.response?.status === 401) {
      }

      return Promise.reject(error)
   }
)
