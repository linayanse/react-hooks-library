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
    query: () =>
      fetch('https://jsonplaceholder.typicode.com/todos/1').then<object>(
        response => response.json()
      ),
  })

  const update = () => {
    setVariable({
      aaa: 11,
    })
  }

  return (
    <>
      <div>
        {JSON.stringify(toggle)}: {JSON.stringify(query.data)}
      </div>

      <div>
        <button onClick={query.refetch}>fetch</button>
      </div>

      <div>
        <button onClick={update}>updateVariable</button>
      </div>
    </>
  )
}
