import React, { useState } from 'react'
import { hot } from 'react-hot-loader'

import { useQuery } from '../dist'

import './index.scss'

export const UseQueryDemo: React.FunctionComponent<{
  toggle: boolean
}> = ({ toggle }) => {
  const query = useQuery({
    initialData: {
      a: '1',
    },
    query: () =>
      fetch('https://jsonplaceholder.typicode.com/todos/1').then<object>(
        response => response.json()
      ),
  })

  return (
    <div>
      {JSON.stringify(toggle)}: {JSON.stringify(query.data)}
    </div>
  )
}
