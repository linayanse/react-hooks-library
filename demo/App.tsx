import React from 'react'
import { hot } from 'react-hot-loader'

import { UseQueryDemo } from './UseQueryDemo'

import './index.scss'

const Demo: React.FunctionComponent = () => {
  return (
    <div>
      <UseQueryDemo />
    </div>
  )
}

export const App = hot(module)(Demo)
