import React, { useCallback, useState, useEffect, Fragment } from 'react'
import styled from 'styled-components'
import { useWallet } from 'use-wallet'
import useTokenBalance from '../../../hooks/useTokenBalance'
import useSushi from '../../../hooks/useSushi'
import { getSushiAddress } from '../../../sushi/utils'
import { getBalanceNumber } from '../../../utils/formatBalance'
import ButtonCustom from './Button'
import CardIcon from '../../../components/CardIcon'
import Label from '../../../components/Label'
import Modal, { ModalProps } from '../../../components/Modal'
import ModalActions from '../../../components/ModalActions'
import ModalContent from '../../../components/ModalContent'
import ModalTitle from '../../../components/ModalTitle'
import Spacer from '../../../components/Spacer'
import Value from '../../../components/Value'
import moment from 'moment';

import { Form, Input, Button, Select, Avatar, DatePicker, Space, message } from 'antd';
import { UserOutlined } from '@ant-design/icons';
const { RangePicker } = DatePicker;

const { Option } = Select;

const dateFormat = 'YYYY-MM-DD HH:mm';

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};
const tailLayout = {
  wrapperCol: { offset: 6, span: 18 },
};

const CreatePool = () => {
  const [form] = Form.useForm();
  const [avatarSrc, setAvatarSrc] = useState('')
  const defaultValueTime: any = [moment().format('YYYY-MM-DD HH:mm'), moment().day(7).format('YYYY-MM-DD HH:mm')]

  const onFinish = (values: any) => {
    console.log(values);
    message.success('开始创建');
  };

  function onChangeAvatar() {
    let data = form.getFieldsValue()
    setAvatarSrc(data.cover)
  }

  function onChangeStart(date: any, dateString: any) {
    // console.log(date, dateString);
    let data = form.getFieldsValue()
    form.setFieldsValue({
      ...data,
      startTime: dateString
    })
  }
  function onChangeEnd(date: any, dateString: any) {
    // console.log(date, dateString);
    let data = form.getFieldsValue()
    form.setFieldsValue({
      ...data,
      endTime: dateString
    })
  }

  useEffect(() => {
    let data = form.getFieldsValue()
    form.setFieldsValue({
      ...data,
      startTime: defaultValueTime[0],
      endTime: defaultValueTime[1]
    })
  }, [])



  return (
    <Fragment>
      <div style={{ display: 'flex' }}>
        <StyledBalanceWrapper>
          <CardIcon>
            <Avatar size={64} src={avatarSrc} />
          </CardIcon>
        </StyledBalanceWrapper>
      </div>
      <Form {...layout} form={form} name="control-hooks" onFinish={onFinish}>
        <Form.Item name="cover" label="Cover" rules={[{ required: true, message: 'Please input your cover url!'  }]}>
          <Input placeholder="Please input you cover" onChange={onChangeAvatar} />
        </Form.Item>
        <Form.Item name="poolName" label="Pool name" rules={[{ required: true, message: 'Please input your pool name!'  }]}>
          <Input placeholder="Please input you cover" />
        </Form.Item>
        <Form.Item name="stake" label="Stake Token" rules={[{ required: true, message: 'Please input your stake token address!'  }]}>
          <Input placeholder="Please input you cover" />
        </Form.Item>
        <Form.Item name="earn" label="Earn Token" rules={[{ required: true, message: 'Please input your earn token address!'  }]}>
          <Input placeholder="Please input you cover" />
        </Form.Item>
        <Form.Item name="startTime" label="Start Time" rules={[{ required: true }]}>
          <Space direction="vertical" size={12}>
            <DatePicker showTime={{ format: 'HH:mm' }} onChange={onChangeStart} defaultValue={moment(defaultValueTime[0], dateFormat)} />
          </Space>
        </Form.Item>
        <Form.Item name="endTime" label="End Time" rules={[{ required: true }]}>
          <Space direction="vertical" size={12}>
            <DatePicker showTime={{ format: 'HH:mm' }} onChange={onChangeEnd} defaultValue={moment(defaultValueTime[1], dateFormat)} />
          </Space>
        </Form.Item>
        <Form.Item {...tailLayout}>
          <Button type="primary" htmlType="submit">
            Create
          </Button>
        </Form.Item>
      </Form>
    </Fragment>
  );
};

const AccountModal: React.FC<ModalProps> = ({ onDismiss }) => {
  const { account, reset } = useWallet()

  const handleSignOutClick = useCallback(() => {
    onDismiss!()
    reset()
  }, [onDismiss, reset])

  const sushi = useSushi()
  const sushiBalance = useTokenBalance(getSushiAddress(sushi))

  return (
    <Modal>
      <ModalTitle text="Create Pool" />
      <ModalContent>
        <Spacer />
        <CreatePool></CreatePool>
        <Spacer />
      </ModalContent>
    </Modal>
  )
}

const StyledBalance = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
`

const StyledBalanceWrapper = styled.div`
  align-items: center;
  display: flex;
  flex: 1;
  flex-direction: column;
  margin-bottom: ${(props) => props.theme.spacing[4]}px;
`

export default AccountModal
