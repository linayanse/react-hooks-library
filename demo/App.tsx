import React, { useState } from 'react'
import { hot } from 'react-hot-loader'

import { UseQueryDemo } from './UseQueryDemo'

import './index.scss'

const Demo: React.FunctionComponent = () => {
  const [te, setTe] = useState(false)

  const toggle = () => {
    setTe(!te)
  }

  return (
    <div>
      <UseQueryDemo toggle={te} />
      <button onClick={toggle}>update</button>
    </div>
  )
}

export const App = hot(module)(Demo)
