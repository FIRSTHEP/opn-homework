import React, { useState, useEffect, useCallback } from 'react';
import { Button, Row, Col, Divider, Spin, Empty, Badge } from 'antd';
import { ShoppingOutlined } from '@ant-design/icons';
import useHttp from '../hooks/use-http';
import { get } from '../helper/api';
import SearchBar from '../component/SearchBar/SearchBar';
import FilterSection from '../component/FilterSection/FilterSection';
import CardList from '../component/CardList/CardList';
import PaginationControls from '../component/PaginationControls/PaginationControls';
import './HomePage.css';
import CartDrawer from '../component/CartDrawer/CartDrawer';
import { debounce } from 'lodash';

const HomePage = () => {
  const { sendRequest, data, error, status } = useHttp(get);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [searchKey, setSearchKey] = useState('');
  const [filters, setFilters] = useState({ sets: null, rarities: null, types: null });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [listOfCards, setListOfCards] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [cart, setCart] = useState([]);

  const fetchListOfCards = useCallback(async (url) => {
    setLoading(true);
    await sendRequest({ url });
    setLoading(false);
  }, [sendRequest]);

  const prepareUrl = useCallback(() => {
    let baseUrl = `/cards?page=${currentPage}&pageSize=${pageSize}`;
    let searchUrl = [];

    if (searchKey) {
      searchUrl.push(`name:"${searchKey}*"`);
    }
    if (filters.sets && filters.sets.length > 0) {
      searchUrl.push(`set.name:"${filters.sets[0].name}"`);
    }
    if (filters.rarities) {
      searchUrl.push(`rarity:"${filters.rarities}"`);
    }
    if (filters.types) {
      searchUrl.push(`types:"${filters.types}"`);
    }

    if (searchUrl.length > 0) {
      baseUrl += `&q=${encodeURIComponent(searchUrl.join(' '))}`;
    }
    return baseUrl;
  }, [filters, searchKey, currentPage, pageSize]);

  const goSearchAction = useCallback(() => {
    const url = prepareUrl();
    fetchListOfCards(url);
  }, [prepareUrl, fetchListOfCards]);

  useEffect(() => {
    goSearchAction();
  }, [filters, searchKey, currentPage, pageSize, goSearchAction]);

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
  };

  const handleSearch = useCallback(
    debounce((value) => {
      setSearchKey(value);
      setCurrentPage(1);
    }, 300),
    []
  );

  const addToCart = (card) => {
    const existingItemIndex = cart.findIndex((item) => item.id === card.id);

    if (existingItemIndex !== -1) {
      const updatedCart = [...cart];
      updatedCart[existingItemIndex].qty++;
      updatedCart[existingItemIndex].totalAmount = updatedCart[existingItemIndex].qty * updatedCart[existingItemIndex].price;
      setCart(updatedCart);
    } else {

      const price = card.cardmarket.prices?.averageSellPrice || 0;

      setCart((prevCart) => [...prevCart, { ...card, qty: 1, price, totalAmount: price }]);
    }
  };

  const removeFromCart = (index) => {
    setCart([])
  };

  const increaseQty = (index) => {
    const updatedCart = [...cart];
    updatedCart[index].qty++;
    setCart(updatedCart);
  };

  const decreaseQty = (index) => {
    const updatedCart = [...cart];
    updatedCart[index].qty--;

    if (updatedCart[index].qty === 0) {
      updatedCart.splice(index, 1);
    }

    setCart(updatedCart);
  };

  const getTotalCardAmount = () => {
    return cart.reduce((total, item) => total + (item.qty), 0);
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.qty), 0);
  };

  const handleCloseDrawer = () => {
    setOpenDrawer(false);
  };

  return (
    <div className="homepage-page">
      <CartDrawer
        isOpen={openDrawer}
        onClose={handleCloseDrawer}
        clearCart={removeFromCart}
        cartItems={cart}
        decreaseQty={decreaseQty}
        increaseQty={increaseQty}
        getTotalCardAmount={getTotalCardAmount}
        getTotalPrice={getTotalPrice}
      />
      <div className="container">
        <Row gutter={[16, 16]} style={{ padding: '2em 0' }}>
          <Col xs={24} md={19}>
            <div className="homepage-header">
              <h1>Pokemon Market</h1>
            </div>
          </Col>
          <Col xs={20} md={4}>
            <SearchBar
              setSearchKey={handleSearch}
              loading={loading}
              goSearchAction={goSearchAction}
            />
          </Col>
          <Col xs={4} md={1} style={{ textAlign: 'right' }}>
            <Badge count={getTotalCardAmount()} overflowCount={99}>
              <Button
                danger
                type="primary"
                onClick={() => setOpenDrawer(true)}
                icon={<ShoppingOutlined />}
                size="large"
                style={{
                  backgroundColor: '#EA7C69',
                  boxShadow: '0 0 10px rgba(234, 124, 105, 0.5)'
              }}
              />
            </Badge>
          </Col>
        </Row>
        <Divider className="custom-divider" />
        <FilterSection filters={filters} handleFilterChange={handleFilterChange} />
        <Spin spinning={loading}>
          {listOfCards.length > 0 ? (
            <CardList listOfCards={listOfCards} addToCart={addToCart} />
          ) : (
            <Empty description="No Data" className="no-data" />
          )}
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
