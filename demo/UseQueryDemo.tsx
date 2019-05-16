import React, { useState } from 'react'

import { useQuery } from '../src'

import './index.scss'

export const UseQueryDemo: React.FunctionComponent<{
  toggle: boolean
}> = ({ toggle }) => {
  const [variable, setVariable] = useState({})
  const query = useQuery({
    initialData: {
      a: '1',
    },
    variable,
    query: (v: object) =>
      fetch(
        `https://jsonplaceholder.typicode.com/todos/1?variable=${JSON.stringify(
          v
        )}`
      ).then<object>(response => response.json()),
  })

  const update = () => {
    setVariable({
      aaa: 11,
    })
  }

  const polling = () => {
    query.startPolling(1000)
  }

  const stopPolling = () => {
    query.stopPolling()
  }

  return (
    <>
      <div>数据：{JSON.stringify(query.data)}</div>

      <div>参数: {JSON.stringify(variable)}</div>

      <div>
        <button onClick={query.refetch}>fetch</button>
      </div>

      <div>
        <button onClick={update}>updateVariable</button>
      </div>

      <div>
        <button onClick={polling}>polling</button>
      </div>

      <div>
        <button onClick={stopPolling}>stopPolling</button>
      </div>
    </>
  )
}
