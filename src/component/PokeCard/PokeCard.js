import React, { useState } from 'react';
import { Row, Col, Card, Button, Image, Space } from 'antd';
import { ShoppingOutlined } from '@ant-design/icons';
import './PokeCard.css';

const PokeCard = ({ data }) => {
  const [size] = useState('large');

  return (
    <div className="poke-card">
      <div className='poke-card-content-bg'>
        <Row className='poke-card-image'>
          <Col span={24}>
            <Image
              width={120}
              className='poke-image'
              src={data?.images?.small || "https://images.pokemontcg.io/hgss4/1.png"}
              alt={data?.name || "Pokemon Image"}
              onError={(e) => { e.target.src = "https://images.pokemontcg.io/hgss4/1.png" }}
            />
          </Col>
        </Row>
        <div className='poke-card-name'>{data?.name}</div>
        <div className='poke-card-info'>
          {`$ ${data?.cardmarket? data?.cardmarket?.prices?.averageSellPrice?.toFixed(2) : 0.00 }`}
          <span className='dot'>●</span>
        {data?.set?.total ? data?.set?.total : data?.total? data?.total : 0}{' '}Cards
          </div>
        <Row className='poke-card-container'>
          <Col span={24}>
            <Button className='poke-card-btn' size={size} icon={<ShoppingOutlined />}>Add to Cart</Button>
          </Col>
        </Row>
      </div>
    </div>
  );
}

export default PokeCard;
