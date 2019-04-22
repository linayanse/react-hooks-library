import { axiosRequest } from '../src/request'

export const request = axiosRequest({
  handleResponse: response => {
    return response.data
  },
  catchErrors: error => {
    throw error
  },
})
