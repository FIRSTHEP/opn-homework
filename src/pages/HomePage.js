import React, { useState, useEffect, useCallback } from 'react';
import { Button, Row, Col, Divider, Drawer, Spin } from 'antd'; // Import Spin component
import { ShoppingOutlined } from '@ant-design/icons';
import useHttp from '../hooks/use-http';
import { get } from '../helper/api';
import SearchBar from '../component/SearchBar/SearchBar';
import FilterSection from '../component/FilterSection/FilterSection';
import CardList from '../component/CardList/CardList';
import PaginationControls from '../component/PaginationControls/PaginationControls';
import { debounce } from 'lodash';
import './HomePage.css';

const HomePage = () => {
  const { sendRequest, data, error, status } = useHttp(get);
  const [open, setOpen] = useState(false);
  const [searchKey, setSearchKey] = useState('');
  const [filters, setFilters] = useState({ sets: null, rarities: null, types: null });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [listOfCards, setListOfCards] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    goSearchAction();
  }, [filters, searchKey]);

  useEffect(() => {
    setLoading(status === 'pending');
  }, [status]);

  const goSearchAction = useCallback(() => {
    const url = prepareUrl();
    fetchListOfCards(url);
  }, [filters, currentPage, pageSize, searchKey]);

  const prepareUrl = () => {
    let baseUrl = `/cards?page=${currentPage}&pageSize=${pageSize}`;
    let searchUrl = "";
    if (searchKey) {
      searchUrl += `name:"${searchKey}" `;
    }
    if (filters.sets) {
      searchUrl += `set.name:"${filters?.sets[0]?.name}" ${' '}`;
    }
    if (searchUrl) {
      searchUrl = encodeURIComponent(searchUrl);
      baseUrl += `&q=${searchUrl} `;
    }
    return baseUrl;
  };

  const fetchListOfCards = useCallback(async (url) => {
    await sendRequest({ url });
  }, [sendRequest]);

  useEffect(() => {
    if (status === 'completed') {
      if (data) {
        setListOfCards(data.data);
        setTotalCount(data.totalCount);
        setPageSize(data.pageSize);
      } else if (error) {
        console.error('Error fetching data:', error);
      }
    }
  }, [status, data, error]);

  const handleFilterChange = (type, value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [type]: value,
    }));
  };

  const handlePaginationChange = (page, pageSize) => {
    setCurrentPage(page);
    setPageSize(pageSize);
    goSearchAction();
  };

  const handleSearch = useCallback(
    (value) => {
      setSearchKey(value);
    },
    [setSearchKey]
  );
  

  const handleClear = () => {
    console.log("clear");
    goSearchAction();
  }

  return (
    <div className="homepage-page">
      <Drawer title="Basic Drawer" onClose={() => setOpen(false)} open={open}>
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
      </Drawer>
      <div className="container">
        <Row gutter={[16, 16]} style={{ padding: '2em 0' }}>
          <Col xs={24} md={19}>
            <div className="homepage-header">
              <h1>Pokemon Market</h1>
            </div>
          </Col>
          <Col xs={24} md={4}>
            <SearchBar setSearchKey={handleSearch} loading={loading} goSearchAction={goSearchAction}/>
          </Col>
          <Col xs={24} md={1} style={{ textAlign: 'right' }}>
            <Button
              danger
              type="primary"
              onClick={() => setOpen(true)}
              icon={<ShoppingOutlined />}
              size="large"
            />
          </Col>
        </Row>
        <Divider className="custom-divider" />
        <FilterSection filters={filters} handleFilterChange={handleFilterChange} />
        {/* Add Spin component to show loading indicator */}
        <Spin spinning={loading}>
          <CardList loading={loading} error={error} listOfCards={listOfCards} />
        </Spin>
        <PaginationControls
          currentPage={currentPage}
          pageSize={pageSize}
          totalCount={totalCount}
          handlePaginationChange={handlePaginationChange}
        />
      </div>
    </div>
  );
};

export default HomePage;
