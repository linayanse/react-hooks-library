import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios'

export type IHandleResponse<P, Data = P> = (
  res: AxiosResponse<Data>,
  ...rest: any[]
) => Data

export interface IAaxiosHandles<ResponseData> {
  handleResponse: IHandleResponse<ResponseData>
  catchErrors?(err: AxiosError): void
}

function variableToParams(
  method: string,
  variable: object
): AxiosRequestConfig {
  if (method === 'PUT' || method === 'POST' || method === 'PATCH') {
    return {
      data: variable,
    }
  } else {
    return {
      params: variable,
    }
  }
}

export function axiosRequest<ResponseData>(
  handles: IAaxiosHandles<ResponseData>
) {
  function handleResponse<Data>(response: AxiosResponse<Data>, ...rest: any[]) {
    return handles.handleResponse
      ? ((handles.handleResponse as unknown) as IHandleResponse<
          ResponseData,
          Data
        >).apply<undefined, [AxiosResponse<Data>, ...any[]], Data>(undefined, [
          response,
          ...rest,
        ])
      : response.data
  }

  const catchErrors = (error: AxiosError) => {
    handles.catchErrors && handles.catchErrors(error)
  }

  function request(method: string) {
    return <Data>(userConfig: AxiosRequestConfig, ...rest: any[]) => async (
      config: AxiosRequestConfig,
      variable: object
    ) =>
      axios
        .request<Data>({
          ...userConfig,
          ...config,
          ...variableToParams(method, variable),
          method,
        })
        .then(response =>
          handleResponse.apply<
            undefined,
            [AxiosResponse<Data>, ...any[]],
            Data
          >(undefined, [response, ...rest])
        )
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
