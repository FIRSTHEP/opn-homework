import React from 'react';
import { Row, Col } from 'antd';
import FilterBox from '../FilterSection/FilterBox/FilterBox';
import './FilterSection.css';


const FilterSection = ({ handleFilterChange }) => {
  return (
    <Row gutter={[16, 16]} style={{ padding: '1em 0 1em 0' }}>
      <Col xs={8} md={12} xxl={12}>
      <h2 id='filter-title'>Choose Card</h2>
      </Col >
      <Col xs={8} md={4} xxl={4}>
        <FilterBox size="large" action="sets" handleFilterChange={(value) => handleFilterChange('sets', value)} />
      </Col>
      <Col xs={8} md={4} xxl={4}>
        <FilterBox size="large" action="rarities" handleFilterChange={(value) => handleFilterChange('rarities', value)} />
      </Col>
      <Col xs={8} md={4} xxl={4}>
        <FilterBox size="large" action="types" handleFilterChange={(value) => handleFilterChange('types', value)} />
      </Col>
    </Row >
  );
};

export default FilterSection;
