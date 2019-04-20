import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios'

export interface IAaxiosHandles {
  handleResponse?<Data>(res: AxiosResponse<Data>, ...rest: any[]): Data
  catchErrors?(err: AxiosError): void
}

export function axiosRequest(handles: IAaxiosHandles) {
  function handleResponse<Data>(response: AxiosResponse<Data>, ...rest: any[]) {
    return handles.handleResponse
      ? handles.handleResponse.apply<
          undefined,
          [AxiosResponse<Data>, ...any[]],
          Data
        >(undefined, [response, ...rest])
      : response.data
  }

  const catchErrors = (error: AxiosError) => {
    handles.catchErrors && handles.catchErrors(error)
  }

  function request(method: string) {
    return (userConfig: AxiosRequestConfig, ...rest: any[]) => async <Data>(
      config: AxiosRequestConfig
    ) =>
      axios
        .request<Data>({
          ...userConfig,
          ...config,
          method,
        })
        .then(response => handleResponse.apply(undefined, [response, ...rest]))
        .catch(catchErrors)
  }

  return {
    request,
    get: request('GET'),
    post: request('POST'),
    put: request('PUT'),
    patch: request('PATCH'),
    delete: request('DELETE'),
  }
}

export { axios }
