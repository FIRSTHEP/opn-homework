import React, { useState } from 'react';
import { Row, Col, Card, Button, Image } from 'antd';
import { ShoppingOutlined } from '@ant-design/icons';
import './CardList.css';

const CardList = ({ listOfCards }) => {
  const [size] = useState('large');
  
  return (
    <Row gutter={[16, 16]} className="poke-card-list">
      {listOfCards && listOfCards.map((data) => (
        <Col key={data.id} xs={24} sm={12} md={8} lg={6} xl={4}>
          <div className="poke-card">
            <div className="poke-card-content-bg">
              <Row className="poke-card-image">
                <Col span={24}>
                  <Image
                    width={120}
                    className="poke-image"
                    src={data?.images?.small || "https://images.pokemontcg.io/hgss4/1.png"}
                    alt={data?.name || "Pokemon Image"}
                    onError={(e) => { e.target.src = "https://images.pokemontcg.io/hgss4/1.png" }}
                  />
                </Col>
              </Row>
              <div className="poke-card-name">{data?.name}</div>
              <div className="poke-card-info">
                {`$${data?.cardmarket?.prices?.averageSellPrice?.toFixed(2) || 0.00}`}
                <span className="dot">●</span>
                {data?.set?.total || data?.total || 0} Cards
              </div>
              <Row className="poke-card-container">
                <Col span={24}>
                  <Button className="poke-card-btn" size={size} icon={<ShoppingOutlined />}>Add to Cart</Button>
                </Col>
              </Row>
            </div>
          </div>
        </Col>
      ))}
    </Row>
  );
};

export default CardList;
