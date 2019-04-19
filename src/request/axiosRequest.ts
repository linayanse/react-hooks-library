import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'

export interface IAaxiosHandles<Response> {
  handleSuccess?<Data>(res: AxiosResponse<Response>): Data | Response
  catchErrors?(err: Error): void
}

export function axiosRequest<IResponse>(handles: IAaxiosHandles<IResponse>) {
  // 响应处理函数
  function handleRes<Data>(response: AxiosResponse<IResponse>) {
    return handles.handleSuccess
      ? handles.handleSuccess<Data>(response)
      : response.data
  }

  // 异常处理函数
  const catchErrors = (error: Error) => {
    handles.catchErrors && handles.catchErrors(error)
  }

  function request(method: string) {
    return (userConfig: AxiosRequestConfig) => async (
      config: AxiosRequestConfig
    ) =>
      axios
        .request<IResponse>({
          ...userConfig,
          ...config,
          method,
        })
        .then(res => handleRes(res))
        .catch(catchErrors)
  }

  return {
    axios,
    request,
    get: request('GET'),
    post: request('POST'),
    put: request('PUT'),
    patch: request('PATCH'),
    delete: request('DELETE'),
  }
}
