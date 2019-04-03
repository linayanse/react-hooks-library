import Sinon from 'sinon'
import { renderHook, act } from 'react-hooks-testing-library'

import { useQuery } from '../../src/hooks'

jest.useFakeTimers()

describe('Component Query', () => {
  it.only('should have initialData', () => {
    const params = {
      initialData: [],
      skip: true,
    }

    const { result } = renderHook(() => useQuery(params))

    expect(result.current.data).toEqual([])
  })

  it('should fetch data even if variable is empty', () => {
    const fetch = Sinon.spy()
    const params = {
      query: fetch,
      skip: false,
    }

    renderHook(() => {
      useQuery(params)
    })

    expect(fetch.calledOnce).toBeTruthy()
  })

  it('should not fetch data when skip is true', () => {
    const fetch = Sinon.spy()
    const params = {
      query: fetch,
      skip: true,
    }

    renderHook(() => {
      useQuery(params)
    })

    expect(fetch.calledOnce).toBeFalsy()
  })

  it('should fetch data when variable change', () => {
    const fetch = Sinon.spy()
    let variable = {}
    const { rerender } = renderHook(() => {
      useQuery({
        query: fetch,
        variable,
      })
    })

    expect(fetch.calledOnce).toBeTruthy()

    act(() => {
      variable = { data: 1 }
      rerender()
    })

    expect(fetch.calledTwice).toBeTruthy()
  })

  it('should`t fetch data when variable not change', () => {
    const fetch = Sinon.spy()
    const { rerender } = renderHook(() => {
      useQuery({
        query: fetch,
      })
    })

    expect(fetch.calledOnce).toBeTruthy()

    rerender({
      query: fetch,
    })

    expect(fetch.calledOnce).toBeTruthy()
  })

  it('should change loading state when fetch', callback => {
    const fetch = jest.fn().mockResolvedValue(42)
    const params = {
      query: fetch,
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

  it('should change data when fetch', callback => {
    const fetch = jest.fn().mockResolvedValue(42)
    const params = {
      query: fetch,
      skip: false,
    }

    const { result } = renderHook(() => {
      return useQuery(params)
    })

    expect(result.current.data).toBeUndefined()

    process.nextTick(() => {
      expect(result.current.data).toBe(42)

      callback()
    })
  })

  it('should have refetch function', callback => {
    const fetch = jest
      .fn()
      .mockResolvedValueOnce(42)
      .mockResolvedValueOnce(2)
    const params = {
      query: fetch,
      skip: false,
    }

    const { result } = renderHook(() => {
      return useQuery(params)
    })

    expect(result.current.data).toBeUndefined()

    process.nextTick(() => {
      expect(result.current.data).toBe(42)

      result.current.refetch().then(() => {
        expect(result.current.data).toBe(2)

        callback()
      })
    })
  })

  it('should have startPolling function', () => {
    const fetch = Sinon.spy()
    const params = {
      query: fetch,
      skip: false,
    }
    const { result } = renderHook(() => {
      return useQuery(params)
    })

    expect(fetch.callCount).toBe(1)

    result.current.startPolling(1000)
    jest.advanceTimersByTime(1000)
    expect(fetch.callCount).toBe(2)

    result.current.stopPolling()
    jest.advanceTimersByTime(1000)
    expect(fetch.callCount).toBe(2)
  })
})
