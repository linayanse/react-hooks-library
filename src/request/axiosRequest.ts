import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios'

export interface IAaxiosHandles<Response> {
  handleResponse?<Data>(
    res: AxiosResponse<Response>,
    ...rest: any[]
  ): Data | Response
  catchErrors?(err: AxiosError): void
}

export function axiosRequest<IResponse>(handles: IAaxiosHandles<IResponse>) {
  function handleResponse<Data>(
    response: AxiosResponse<IResponse>,
    ...rest: any[]
  ) {
    return handles.handleResponse
      ? handles.handleResponse.apply<
          undefined,
          [AxiosResponse<IResponse>, ...any[]],
          Data | IResponse
        >(undefined, [response, ...rest])
      : response.data
  }

  const catchErrors = (error: AxiosError) => {
    handles.catchErrors && handles.catchErrors(error)
  }

  function request(method: string) {
    return (userConfig: AxiosRequestConfig, ...rest: any[]) => async (
      config: AxiosRequestConfig
    ) =>
      axios
        .request<IResponse>({
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
