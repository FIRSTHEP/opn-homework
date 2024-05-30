import React from 'react';
import { Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { debounce } from 'lodash';
import './SearchBar.css';

const SearchBar = ({ searchKey, setSearchKey, loading }) => {
  const debouncedSearch = debounce((key) => {
    setSearchKey(key.trim());
  }, 500);

  const handleSearch = (e) => {
    const key = e.target.value;
    debouncedSearch(key);
  };

  const handleClear = () => {
    setSearchKey('');
  };

  return (
    <Input
      size="large"
      disabled={loading}
      id="search_box"
      placeholder="Search by name"
      onPressEnter={handleSearch}
      onClear={handleClear}
      className="custom-search"
      allowClear
      prefix={<SearchOutlined style={{ color: 'white' }} />}
      style={{ backgroundColor: '#1F1D2B', color: 'blue' }}
    />
  );
};

export default SearchBar;
