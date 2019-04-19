import { axiosRequest } from '../src/request'

// tslint:disable-next-line: export-name
export const request = axiosRequest<[]>({
  handleSuccess: res => {
    return res.data
  },
  catchErrors: err => {
    throw err
  },
})
