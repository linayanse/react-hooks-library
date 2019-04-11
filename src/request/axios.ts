import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios'

export type IHandleReponse<T> = (
  response: AxiosResponse<T>
) => [boolean, AxiosResponse<T>]
export type IHandleError = (error: AxiosError) => void

let handleResponse: IHandleReponse<any> = response => [true, response]
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
    .then(handleResponse)
    .catch(handleError)
}

export { axios }
