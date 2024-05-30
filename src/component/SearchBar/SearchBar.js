import React, { useState } from 'react';
import { Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import './SearchBar.css';

const SearchBar = ({ setSearchKey, loading, goSearchAction }) => {
  const [searchValue, setSearchValue] = useState('');

  const onClear = () => {
    setSearchValue('');
    setSearchKey('');
  };

  const handleSearch = () => {
    setSearchKey(searchValue);
    goSearchAction();
  };

  return (
    <Input
      size="large"
      disabled={loading}
      value={searchValue}
      placeholder="Search by name"
      onChange={(e) => setSearchValue(e.target.value)}
      onPressEnter={handleSearch}
      onClear={onClear}
      className="custom-search"
      allowClear
      prefix={<SearchOutlined style={{ color: 'white' }} />}
      style={{ color: 'white' }}
    />
  );
};

export default SearchBar;
