import * as React from 'react'
import { hot } from 'react-hot-loader'

import { useQuery } from '../dist'

import './index.scss'

const Demo: React.FunctionComponent = () => {
  const query = useQuery({
    initialData: {
      a: '1',
    },
    query: () =>
      fetch('https://jsonplaceholder.typicode.com/todos/1').then<object>(
        response => response.json()
      ),
  })

  return <div>{JSON.stringify(query.data)}</div>
}

export const App = hot(module)(Demo)
