import React, { useState, useEffect, useCallback } from 'react';
import { ShoppingOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Row, Input, Col, Divider, Spin, Alert, Pagination, Drawer } from 'antd';
import FilterBox from '../component/FilterBox/FilterBox';
import PokeCard from '../component/PokeCard/PokeCard';
import useHttp from '../hooks/use-http';
import { get } from '../helper/api';
import './HomePage.css';
import { debounce } from 'lodash';

const HomePage = () => {
  const { sendRequest, data, error, status } = useHttp(get);
  const [open, setOpen] = useState(false);
  const [state, setState] = useState({
    searchKey: '',
    loading: false,
    listOfCards: [],
    totalCount: 0,
    pageSize: 10,
    currentPage: 1,
    filters: {
      sets: null,
      rarities: null,
      types: null,
    },
    size: 'large',
  });

  useEffect(() => {
    if (state.searchKey !== '') {
      goSearchAction();
    }
  }, [state.searchKey]);

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    goSearchAction();
  }, []);

  useEffect(() => {
    setState(prevState => ({ ...prevState, loading: status === 'pending' }));
  }, [status]);

  const goSearchAction = useCallback((pagingParam = null) => {
    const url = prepareUrl(pagingParam);
    console.log("url:", url);
    fetchListOfCards(url);
  }, [state.filters, state.currentPage, state.pageSize, state.searchKey]);

  const prepareUrl = (pagingParam) => {
    let url;
    if (state?.filters?.sets) {
      url = `/sets?q=legalities.standard:${state?.filters?.sets[0]?.legalities?.unlimited}&page=${state.currentPage}&pageSize=${state.pageSize}`;
    } else if (state?.filters?.rarities) {
      url = '/rarities'; // Change URL to /rarities when rarities filter is selected
    } else {
      url = `/cards?page=${state.currentPage}&pageSize=${state.pageSize}`;
      if (state.searchKey) {
        url += `&q=set.name:${state.searchKey} subtypes:mega`; // Construct query for searching by card name and subtypes
      }
      Object.entries(state.filters).forEach(([key, value]) => {
        if (value && key !== 'sets' && key !== 'rarities') {
          url += `&q=${key}:${value}`;
        }
      });
    }
    if (pagingParam) {
      url += pagingParam;
    }
    return url;
  };

  const fetchListOfCards = useCallback(async (url) => {
    await sendRequest({ url });
  }, [sendRequest]);

  useEffect(() => {
    if (status === 'completed') {
      if (data) {
        setState(prevState => ({
          ...prevState,
          listOfCards: data.data,
          totalCount: data.totalCount,
          pageSize: data.pageSize,
        }));
      } else if (error) {
        console.error('Error fetching data:', error);
      }
    }
  }, [status, data, error]);

  const debouncedSearch = useCallback(debounce((key) => {
    setState(prevState => ({ ...prevState, searchKey: key.trim() }));
    goSearchAction();
  }, 500), [goSearchAction]);

  const handleSearch = (e) => {
    const key = e.target.value;
    debouncedSearch(key);
  };

  const handleClear = () => {
    goSearchAction();
    setState(prevState => ({
      ...prevState,
      searchKey: '',
      filters: {
        sets: null,
        rarities: null,
        types: null,
      },
    }));
  };

  const handleFilterChange = (type, value) => {
    setState(prevState => ({
      ...prevState,
      filters: {
        ...prevState.filters,
        [type]: value,
      },
    }));
  };

  useEffect(() => {
    goSearchAction();
  }, [state.filters]);

  useEffect(() => {
    if (state.filters.sets && state.filters.sets.length === 0) {
      goSearchAction();
    }
  }, [state.filters.sets]);

  const handlePaginationChange = (page, pageSize) => {
    setState(prevState => ({
      ...prevState,
      currentPage: page,
      pageSize: pageSize,
    }));
    goSearchAction(`&page=${page}&pageSize=${pageSize}`);
  };

  return (
    <div className="homepage-page">
      <Drawer title="Basic Drawer" onClose={onClose} open={open}>
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
      </Drawer>
      <div className="container">
        <Row gutter={[16, 16]} style={{ padding: '2em 0 2em 0' }}>
          <Col xs={24} md={15} xxl={19}>
            <div className="homepage-header">
              <h1>Pokemon market</h1>
            </div>
          </Col>
          <Col xs={20} md={8} xxl={4}>
            <Input
              size={state.size}
              disabled={state.loading}
              id="search_box"
              placeholder="Search by name"
              onPressEnter={(e) => handleSearch(e)}
              onClear={handleClear}
              className="custom-search"
              allowClear
              prefix={<SearchOutlined style={{ color: 'white' }} />}
              style={{ backgroundColor: '#1F1D2B', color: 'blue' }}
            />
          </Col>
          <Col xs={4} md={1} xxl={1} style={{ textAlign: 'right' }}>
            <Button
              danger
              type="primary"
              onClick={showDrawer}
              icon={<ShoppingOutlined />}
              size={state.size} />
          </Col>
        </Row>
        <Divider className="custom-divider" />
        <Row gutter={[16, 16]} style={{ padding: '1em 0 1em 0' }}>
          <Col xs={24} md={12} xxl={12}>
            <div className="homepage-title">
              <h2 style={{ margin: '1em 0 0 0' }}>Choose Card</h2>
            </div>
          </Col>
          <Col xs={8} md={4} xxl={4}>
            <FilterBox size={state.size} action={'sets'} handleFilterChange={(value) => handleFilterChange('sets', value)} />
          </Col>
          <Col xs={8} md={4} xxl={4}>
            <FilterBox size={state.size} action={'rarities'} handleFilterChange={(value) => handleFilterChange('rarities', value)} />
          </Col>
          <Col xs={8} md={4} xxl={4}>
            <FilterBox size={state.size} action={'types'} handleFilterChange={(value) => handleFilterChange('types', value)} />
          </Col>
        </Row>
        {/* Display cards */}
        {state.loading ? (
          <div style={{ textAlign: 'center' }}>
            <Spin size="large" />
          </div>
        ) : error ? (
          <Alert message={`Error: ${error}`} type="error" />
        ) : (
          <Row gutter={[16, 16]} style={{ marginBottom: '1.5em' }}>
            {state.listOfCards.map((card, index) => (
              <Col key={index} xs={24} sm={8} md={8} xl={6} xxl={4}>
                <PokeCard data={card} />
              </Col>
            ))}
          </Row>
        )}
        <div className="pagination-container">
          <Pagination
            showSizeChanger
            onChange={handlePaginationChange}
            current={state.currentPage}
            pageSize={state.pageSize}
            total={state.totalCount}
          />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
