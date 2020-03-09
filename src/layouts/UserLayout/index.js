import React from 'react'
import { Link, Redirect, Switch, Route } from 'dva/router'
import DocumentTitle from 'react-document-title'
import registerState from '../../xblock/registerState'
import { connect } from 'dva'

@connect(({'@@app': {logo, title}}) => ({logo, title}))
class UserLayout extends React.PureComponent {
  getPageTitle () {
    const title = this.props.title
    const routerData = registerState.userRouter
    const {location} = this.props
    const {pathname} = location
    let theTitle = title
    if (routerData[pathname] && routerData[pathname].name) {
      theTitle = `${routerData[pathname].name} - ${title}`
    }
    return theTitle
  }

  render () {
    return (
      <DocumentTitle title={this.getPageTitle()}>
        <div className='xblock-user-layout-container'>
          <div className='content'>
            <div className='top'>
              <div className='header'>
                <Link to="/">
                  <img alt="logo" className='logo' src={this.props.logo}/>
                  <span className='title'>{this.props.title}</span>
                </Link>
              </div>
            </div>
            <Switch>
              {registerState.userRouter.map(item => (
                <Route
                  key={item.path}
                  path={item.path}
                  component={item.component}
                  exact={item.exact}
                />
              ))}
              <Redirect exact from="/user" to="/user/login/index"/>
            </Switch>
          </div>
        </div>
      </DocumentTitle>
    )
  }
}

export default UserLayout
