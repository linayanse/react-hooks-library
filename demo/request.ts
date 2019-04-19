import { axiosRequest, axios } from '../src/request'

// tslint:disable-next-line: export-name
export const request = axiosRequest<[]>({
  handleResponse: res => {
    return res.data
  },
  catchErrors: err => {
    throw err
  },
})
