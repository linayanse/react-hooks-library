import Sinon from 'sinon'
import { renderHook, act } from 'react-hooks-testing-library'

import { useQuery } from '../../src/hooks'

jest.useFakeTimers()

describe('Component Query', () => {
  it('should have initialData', () => {
    const params = {
      initialData: [],
      skip: true,
    }

    const { result } = renderHook(() => useQuery(params))

    chaiExpect(result.current.data).to.be.eql([])
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

    chaiExpect(fetch.calledOnce).to.be.true
  })

  it('should not fetch data when skip is true', () => {
    const fetch = Sinon.spy()
    const params = {
      query: fetch,
      skip: true,
    }
    const { rerender } = renderHook(() => {
      useQuery(params)
    })

    chaiExpect(fetch.calledOnce).to.be.false

    params.skip = false
    act(() => {
      rerender()
    })

    chaiExpect(fetch.calledOnce).to.be.true
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

    chaiExpect(fetch.calledOnce).to.be.true

    act(() => {
      variable = { data: 1 }
      rerender()
    })

    chaiExpect(fetch.calledTwice).to.be.true
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

    chaiExpect(result.current.loading).to.be.true

    process.nextTick(() => {
      chaiExpect(result.current.loading).to.be.false
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

    chaiExpect(result.current.data).to.be.undefined

    process.nextTick(() => {
      chaiExpect(result.current.data).to.be.equal(42)

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

    chaiExpect(result.current.data).to.be.undefined

    process.nextTick(() => {
      chaiExpect(result.current.data).to.be.equal(42)

      result.current.refetch().then(() => {
        chaiExpect(result.current.data).to.be.equal(2)

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

    chaiExpect(fetch.callCount).to.be.equal(1)

    result.current.startPolling(1000)
    jest.advanceTimersByTime(1000)
    chaiExpect(fetch.callCount).to.be.equal(2)

    result.current.stopPolling()
    jest.advanceTimersByTime(1000)
    chaiExpect(fetch.callCount).to.be.equal(2)
  })
})
