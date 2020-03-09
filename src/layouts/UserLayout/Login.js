import React, { Component } from 'react'
import { connect } from 'dva'
import { Alert, message, Input, Button, Form } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import { login } from '../../action'

const FormItem = Form.Item
const Password = Input.Password
@connect(({login, loading}) => ({
  login,
  submitting: loading.effects['login/login'],
  register: loading.effects['login/register'],
}))
export default class LoginPage extends Component {
  constructor (props) {
    super(props)
  }

  state = {
    type: 'account',
    autoLogin: true,
  }

  onTabChange = type => {
    this.resetFields()
    this.setState({type})
  }

  handleSubmit = (values) => {

    const {params: {path}} = this.props.match
    const goPath = path ? path.replace(/@/g, '/') : null
    login({
      payload: {
        ...values,
        device_uuid: localStorage.getItem('device_uuid'),
      },
      goPath,
    }).then((res) => message.error(res?.message || '请求失败'))

  }


  render () {
    const {} = this.props
    const username = {
      props: {
        prefix: <UserOutlined className='prefix-icon'/>,
        placeholder: '请输入用户名',
      },
      rules: [
        {
          required: true,
          message: '请输入用户名!',
        },
      ],
    }
    const password = {
      props: {
        prefix: <LockOutlined className='prefix-icon'/>,
        placeholder: '请输入密码',
      },
      rules: [
        {
          required: true,
          message: '请输入密码!',
        },
      ],
    }

    return (
      <div className='xblock-user-layout-main'>
        <div className='login'>
          <Form onFinish={this.handleSubmit} name="login-form">
            <div className='tabs'>
              <FormItem name='username' rules={username.rules}>
                <Input {...username.props} className='input'/>
              </FormItem>
              <FormItem name='password' rules={password.rules}>
                <Password {...password.props} className='input'/>
              </FormItem>
              <FormItem>
                <Button size="large" className='submit' type="primary" htmlType="submit">
                  登 录
                </Button>
              </FormItem>
            </div>
          </Form>

        </div>
      </div>
    )
  }
}
