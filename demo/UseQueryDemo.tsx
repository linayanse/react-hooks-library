import React, { useState } from 'react'

import { useQuery } from '../src'
import { request } from './request'

export interface ICommonResponse {
  code: number
  data: any
  message?: string
}

import './index.scss'

export const UseQueryDemo: React.FunctionComponent = () => {
  const [variable, setVariable] = useState({})
  const query = useQuery<[]>({
    initialData: [],
    variable,
    query: request.get({
      url: 'https://jsonplaceholder.typicode.com/todos',
    }),
  })

  const update = () => {
    setVariable({
      aaa: 11,
    })
  }
  const startPolling = () => {
    query.startPolling(1000)
  }
  const stopPolling = () => {
    query.stopPolling()
  }
  const cancel = () => {
    query.cancel()
  }

  return (
    <>
      {query.loading ? (
        <div>loading</div>
      ) : (
        <ul>
          {query.data.slice(0, 10).map(todo => (
            <li key={todo['id']}>
              <input
                type={'checkbox'}
                value={todo['completed']}
                aria-checked={'true'}
              />

              <span>{todo['title']}</span>
            </li>
          ))}
        </ul>
      )}

      <div>
        <button
          onClick={() => {
            query.refetch()
          }}
        >
          refetch
        </button>
      </div>

      <div>
        <button onClick={update}>updateVariable</button>
      </div>

      <div>
        <button onClick={startPolling}>startPolling</button>
      </div>

      <div>
        <button onClick={stopPolling}>stopPolling</button>
      </div>

      <div>
        <button onClick={cancel}>cancel</button>
      </div>
    </>
  )
}
