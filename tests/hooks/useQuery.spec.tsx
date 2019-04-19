import { renderHook } from 'react-hooks-testing-library'
import MockAdapter from 'axios-mock-adapter'

import { axiosRequest, useQuery } from '../../src'

const request = axiosRequest({
  handleSuccess: res => res.data,
  catchErrors: error => {
    console.log(error)
  },
})

jest.useFakeTimers()

const mock = new MockAdapter(request.axios)
const API_TEST = 'http://test.com'
const response = 'test'

mock.onGet(API_TEST).reply(200, response)

describe('Component Query', () => {
  it('should have initialData', () => {
    const params = {
      query: request.get({
        url: API_TEST,
      }),
      initialData: [],
      skip: true,
    }

    const { result } = renderHook(() => useQuery(params))

    expect(result.current.data).toEqual([])
  })

  it('should fetch data even if variable is empty', callback => {
    const params = {
      query: request.get({
        url: API_TEST,
      }),
      skip: false,
    }

    const { result } = renderHook(() => useQuery(params))

    process.nextTick(() => {
      expect(result.current.data).toBe('test')
      callback()
    })
  })

  it('should change loading state when fetch', callback => {
    const params = {
      query: request.get({
        url: API_TEST,
      }),
      skip: false,
    }

    const { result } = renderHook(() => {
      return useQuery(params)
    })

    expect(result.current.loading).toBeTruthy()

    process.nextTick(() => {
      expect(result.current.loading).toBeFalsy()
      callback()
    })
  })

  it('should not fetch data when skip is true', () => {
    const params = {
      query: request.get({
        url: API_TEST,
      }),
      skip: true,
    }

    const { result } = renderHook(() => useQuery(params))

    expect(result.current.loading).toBeFalsy()
    expect(result.current.data).toBeUndefined()
  })

  it('should fetch data when variable change', async () => {
    const { result, rerender, waitForNextUpdate } = renderHook(
      props => useQuery(props),
      {
        initialProps: {
          skip: true,
          query: request.get({
            url: API_TEST,
          }),
          variable: {},
        },
      }
    )

    expect(result.current.data).toBeUndefined()

    rerender({
      skip: true,
      query: request.get({
        url: API_TEST,
      }),
      variable: {
        data: 'test',
      },
    })

    await waitForNextUpdate()
    expect(result.current.data).toBe(response)
  })

  it('should`t fetch data when variable not change', () => {
    const { result, rerender } = renderHook(() =>
      useQuery({
        skip: true,
        query: request.get({
          url: API_TEST,
        }),
      })
    )

    expect(result.current.data).toBeUndefined()

    rerender({
      skip: true,
      query: {
        url: API_TEST,
      },
    })

    expect(result.current.data).toBeUndefined()
  })

  it('should have refetch function', callback => {
    const { result } = renderHook(() =>
      useQuery({
        skip: true,
        query: request.get({
          url: API_TEST,
        }),
      })
    )

    expect(result.current.data).toBeUndefined()

    result.current.refetch().then(() => {
      expect(result.current.data).toBe(response)

      callback()
    })
  })

  it('should have cancel funciton', async () => {
    const { result, waitForNextUpdate } = renderHook(props => useQuery(props), {
      initialProps: {
        query: request.get({
          url: API_TEST,
        }),
      },
    })

    expect(result.current.data).toBeUndefined()

    result.current.cancel()

    await waitForNextUpdate()
    expect(result.current.data).toBeUndefined()
  })
})
