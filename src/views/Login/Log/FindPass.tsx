import { notificationApi, userInfoState } from '@/store/appStore'
import { findPasswordApi, getVerifyApi } from '@/api/user'
import myHooks from '@/tool/myHooks/myHooks'
import { Button, Col, Form, Input, Modal, Row } from 'antd'
import React, { useState } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'

const FindPass: React.FC<{
  openFindPwModal: boolean
  setOpenFindPwModal: Function
}> = (props) => {
  const notification = useRecoilValue(notificationApi)
  const { openFindPwModal, setOpenFindPwModal } = props
  const info = useRecoilValue(userInfoState)
  const [form2] = Form.useForm()
  const [verifyBtnDisable, setVerifyBtnDisable] = useState(false)
  const [loading, setLoading] = useState(false)
  const [loading1, setLoading1] = useState(false)
  const { count, start } = myHooks.useCountdown(60, () => {
    setVerifyBtnDisable(false)
  })

  const handleVerifyBtnClick = () => {
    const email = form2.getFieldValue('email')
    email && getVerify(email)
  }

  const getVerify = (email: string) => {
    setLoading(true)
    getVerifyApi(email)
      .then((res) => {
        if (res.data.code === 200) {
          start()
          setVerifyBtnDisable(true)
          notification &&
            notification.success({
              message: '验证码获取成功',
              description: `验证码已发送至您的邮箱 ${email}`,
            })
        }
      })
      .finally(() => {
        setLoading(false)
      })
  }

  const handleFindBtnClick = () => {
    form2.validateFields().then((res) => {
      setLoading(true)
      const formData = new FormData()
      formData.append('Email', res.email)
      formData.append('Verify', res.verify)
      findPasswordApi(formData)
        .then((res) => {
          if (res.data.code === 200) {
            notification &&
              notification.success({
                message: '密码已重置',
                description: `系统重置的新密码已发送至您的邮箱 ${info?.email}，出于安全考虑，请尽快更改密码。`,
                duration: 10,
              })
          }
        })
        .finally(() => {
          setLoading(false)
        })
    })
  }

  return (
    <div>
      <Modal
        title="找回密码"
        open={openFindPwModal}
        onCancel={() => setOpenFindPwModal(false)}
        style={{
          translate: '0 50%',
        }}
        footer={[
          <Button key={'findPassword'} type="primary" onClick={handleFindBtnClick}>
            找回密码
          </Button>,
        ]}
      >
        <Form form={form2} layout="vertical">
          <Form.Item
            name={'email'}
            label="邮箱："
            rules={[
              {
                type: 'email',
                message: '邮箱格式错误',
              },
            ]}
          >
            <Input defaultValue={info?.email}></Input>
          </Form.Item>
          <Row gutter={8}>
            <Col span={8}>
              <Form.Item
                name={'verify'}
                label="验证码："
                rules={[
                  {
                    type: 'string',
                    len: 6,
                    message: '验证码格式错误',
                  },
                ]}
              >
                <Input></Input>
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item label=" ">
                <Button loading={loading} disabled={verifyBtnDisable} onClick={handleVerifyBtnClick}>
                  {verifyBtnDisable && `${count} 秒后重新获取`}
                  {!verifyBtnDisable && '获取验证码'}
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  )
}

export default FindPass
