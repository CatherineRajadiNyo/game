import 'regenerator-runtime/runtime'
import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import { CookiesProvider } from 'react-cookie'

import './index.css'
import Routes from './routes'

ReactDOM.render(
  <CookiesProvider>
    <BrowserRouter>
      <Routes />
    </BrowserRouter>
  </CookiesProvider>,
  document.getElementById('root')
)
