import dva from 'dva'
import React from 'react'
import createLoading from 'dva-loading'
import Provider from './Provider'
import Bootstrap from '../bootstrap'
import Route from './route'
import registerState from './registerState'
import register from './register'

export default class XBlock {
  dva = {}
  provider_list = []
  dispatch = null
  getState = null
  model = null
  register = register

  constructor () {
    this.provider_list.push(new Bootstrap)
  }

  onError = (e, dispatch) => {
    console.log(e.message)
  }

  run (root, props) {
    const app = dva({
      onError: this.onError,
    })
    this.dva = app
    this.model = app.model
    this.register.appConfig = (data) => {
      const appModeled = app._models.find(i => i.namespace === '@@app')
      appModeled.state = data
    }
    this.provider_list.forEach(provider => {
      provider.app = this
      provider.boot(app)
    })
    app.use(createLoading())
    app.router((p) => <Route {...p} {...props} />)
    app.start(root)
    registerState.dispatch = this.dispatch = app._store.dispatch
    registerState.getState = this.getState = app._store.getState
    this.dva = app
    this.provider_list.forEach(provider => {
      provider.app = this
      provider.register(this.register)
    })
    return this
  }

  provider (provider) {
    const obj = new provider
    if (obj instanceof Provider) {
      this.provider_list.push(obj)
    }
  }
}