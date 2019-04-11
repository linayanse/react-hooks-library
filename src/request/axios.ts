import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios'

export type IHandleReponse<T> = (
  response: AxiosResponse<T>
) => {
  isSuccess: boolean
  response: AxiosResponse<T>
  data: T
}
export type IHandleError = (error: AxiosError) => void

let handleResponse: IHandleReponse<any> = response => ({
  isSuccess: true,
  response,
  data: response.data,
})
let handleError: IHandleError = () => {}

export const defaultsConfig: AxiosRequestConfig = {
  timeout: 10000,
}

export const configure = <T>(handles: {
  handleResponse?: IHandleReponse<T>
  handleError?: IHandleError
}) => {
  if (handles.handleResponse) {
    handleResponse = handles.handleResponse
  }

  if (handles.handleError) {
    handleError = handles.handleError
  }
}

export const request = async <T>(config: AxiosRequestConfig) => {
  return axios
    .request<T>(config)
    .then(handleResponse as IHandleReponse<T>)
    .catch(handleError)
}

export { axios }
