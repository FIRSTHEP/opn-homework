import React, { useState, useEffect, useCallback } from 'react';
import { Select } from 'antd';
import useHttp from '../../../hooks/use-http';
import { get } from '../../../helper/api';
import './FilterBox.css';

const FilterBox = ({ size, action, handleFilterChange }) => {
  const { sendRequest, data, error, status } = useHttp(get);
  const [listOfSet, setListOfSet] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedValue, setSelectedValue] = useState(null);

  const getList = useCallback(async (action) => {
    setLoading(true);
    await sendRequest({ url: `/${action}` });
  }, [sendRequest]);

  const prepareListOfSet = useCallback((value) => {
    setListOfSet(value);
  }, []);

  useEffect(() => {
    if (action) {
      getList(action);
    }
  }, [action, getList]);

  const handleChange = (value) => {
    setSelectedValue(value);
    let data;
    if (value === null) {
      handleFilterChange(action);
    } else {
      if (action === 'sets') {
        data = listOfSet?.filter((e) => e.id === value);
      } else {
        data = value;
      }
      handleFilterChange(data);
    }
  }

  useEffect(() => {
    if (status === 'completed') {
      if (data) {
        prepareListOfSet(data.data);
      } else if (error) {
        console.error('Error fetching data:', error);
      }
      setLoading(false);
    }
  }, [status, data, error, prepareListOfSet]);

  useEffect(() => {
    if (action && !listOfSet.find(item => item?.id === action || item === action)) {
      setListOfSet(prevList => [...prevList, { id: action, name: action }]);
    }
  }, [action, listOfSet]);

  const options = listOfSet.map(item => ({
    value: item?.id ? item?.id : item,
    label: item.name ? item.name : item,
  }));

  return (
    <div>
      <Select
        size={size}
        loading={loading}
        value={selectedValue}
        className="custom-select"
        onChange={handleChange}
        options={options}
        allowClear
        onClear={() => {
          setSelectedValue(null)
        }}
        placeholder={`${action}`}
        dropdownStyle={{ backgroundColor: '#1F1D2B' }}
        popupClassName="custom-dropdown"
      />
    </div>
  );
};

export default FilterBox;
