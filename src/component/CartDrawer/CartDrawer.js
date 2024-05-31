import React from 'react';
import { Drawer, Row, Col, Button, Divider, Image } from 'antd';
import { CloseOutlined, MinusOutlined, PlusOutlined } from '@ant-design/icons';

const CartDrawer = ({ isOpen, onClose, cartItems, decreaseQty, increaseQty, getTotalCardAmount, getTotalPrice, clearCart }) => {
  return (
    <Drawer
      title={
        <Row>
          <Col span={12}>
            <h1 style={{ margin: 0, color: 'white' }}>Cart</h1>
            <div style={{ marginTop: '-5px', marginBottom: '5px' }}>
              <a href="#" style={{ textDecoration: 'underline', fontSize: '12px', color: '#ABBBC2' }} onClick={clearCart}>Clear all</a>
            </div>
          </Col>
          <Col span={12}>
            <Button
              type="text"
              size="large"
              icon={<CloseOutlined style={{ color: 'white', fontSize: '16px' }} />}
              style={{ backgroundColor: '#EA7C69', boxShadow: '0 0 10px rgba(234, 124, 105, 0.5)', float: 'right', height: '50px', width: '50px' }}
              onClick={onClose}
            />
          </Col>
        </Row>
      }
      placement="right"
      closable={false}
      onClose={onClose}
      open={isOpen}
      style={{ paddingTop: '0px !important', position: 'relative', backgroundColor: '#1F1D2B' }}
    >
      {cartItems.length === 0 ? (
        <div style={{ textAlign: 'center', marginTop: '20px', marginBottom: '40px', color: 'white' }}>No items</div>
      ) : (
        <div className="cart-items">
          <Row justify="space-between">
            <Col span={5} style={{ textAlign: 'left', color: 'white' }}>Item</Col>
            <Col span={14} style={{ textAlign: 'left', color: 'white' }}>Qty</Col>
            <Col span={5} style={{ textAlign: 'right', color: 'white' }}>Price</Col>
          </Row>
          <Divider style={{ marginTop: '6px', marginBottom: '24px', borderColor: '#252836' }} />
          {cartItems.map((item, index) => (
            <div key={index} className="cart-item" style={{ marginBottom: index === cartItems.length - 1 ? '40px' : '5px' }}>
              <Row justify="space-between" align="middle">
                <Col span={5}>
                  <Image src={item.images.small} alt={item.name} style={{ width: '50px', marginBottom: '8px' }} />
                </Col>
                <Col span={14} style={{ textAlign: 'left', paddingBottom: '40px', color: 'white' }}>
                  <div style={{ marginBottom: '5px' }}>{item.name}</div>
                  <div style={{ color: '#ABBBC2' }}>${' '}{item.price}</div>
                </Col>
                <Col span={5} style={{ textAlign: 'right', paddingBottom: '55px', color: 'white' }}>
                  <div>${(item.price * item.qty).toFixed(2)}</div>
                </Col>
              </Row>
              <Row justify="end" gutter={[16, 16]}>
                <Col xs={5} sm={5} md={5} lg={5} xl={5}>
                  <Button icon={<MinusOutlined style={{ fontSize: '14px' }} />} size="large" onClick={() => decreaseQty(index)} style={{ width: '100%', height: 55, backgroundColor: '#322f3c', border: 0, color: "white" }} />
                </Col>
                <Col xs={14} sm={14} md={14} lg={14} xl={14} style={{ textAlign: 'center', backgroundColor: '#322f3c', color: 'white', fontSize: '1.2em', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '6px' }}>
                  <span>{item.qty}</span>
                </Col>
                <Col xs={5} sm={5} md={5} lg={5} xl={5}>
                  <Button icon={<PlusOutlined style={{ fontSize: '14px' }} />} size="large" onClick={() => increaseQty(index)} style={{ width: '100%', height: 55, backgroundColor: '#322f3c', border: 0, color: "white" }} />
                </Col>
              </Row>
              <br />
            </div>
          ))}
        </div>
      )}
      <div style={{ position: 'absolute', bottom: 0, width: '330px', backgroundColor: '#1F1D2B' }}>
        <Row justify="end" style={{ paddingTop: '20px' }}>
          <Col span={12} style={{ color: '#ABBBC2' }}>Total card amount</Col>
          <Col span={12}><span style={{ float: 'right', color: 'white', fontSize: '16px' }}>{getTotalCardAmount()}</span></Col>
        </Row>
        <Row justify="end" style={{ paddingTop: '20px' }}>
          <Col span={12} style={{ color: '#ABBBC2' }}>Total price</Col>
          <Col span={12}><span style={{ float: 'right', color: 'white', fontSize: '16px' }}>${' '}{getTotalPrice().toFixed(2)}</span></Col>
        </Row>
        <Row justify="end" style={{ paddingTop: '20px', paddingBottom: '30px' }}>
          <Col span={24}>
            <Button type="primary" size="large" block style={{
              backgroundColor: '#EA7C69',
              boxShadow: '0 0 10px rgba(234, 124, 105, 0.5)',
              color: 'white',
              marginBottom: '1em'
            }}>Continue to Payment</Button>
          </Col>
        </Row>
      </div>
    </Drawer>
  );
};

export default CartDrawer;
