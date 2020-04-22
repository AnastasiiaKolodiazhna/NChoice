import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import {
  filterAddBrand,
  filterAddColor,
  filterAddCategories,
  filterRemoveColor,
  filterRemoveCategory,
  filterRemoveBrand,
} from '../../actions';

import FilterItem from '../filterItem';
import withStoreService from '../hoc';
import { Button } from 'react-bootstrap';
import './filter.css';

const Filter = ({
  storeService,
  filterAddBrand,
  filterAddCategories,
  filterAddColor,
  filterRemoveBrand,
  filterRemoveCategory,
  filterRemoveColor,
  catalogLoaded,
  match
}) => {
  const [getBrands, setBrands] = useState([]);
  const [getCategories, setCategories] = useState([]);
  const [getColors, setColors] = useState([]);
  const [isVisible, setIsVisible] = useState(false)

  const showFilterClass = isVisible ? 'show-filter' : ''
  const buttonClass = isVisible ? 'fa fa-angle-left' : 'fa fa-angle-right'

  useEffect(() => {
    storeService
      .getAllBrands()
      .then((response) => setBrands(response))
      .catch((err) => console.log(err));

    storeService
      .getAllColors()
      .then((response) => setColors(response))
      .catch((err) => console.log(err));

  }, [catalogLoaded, storeService]);

  useEffect(() => {
    const catalog = match.params.name
    storeService
      .getCatalogCategories(catalog)
      .then((response) => {
        setCategories(response)
      })
      .catch((err) => console.log(err));
  }, [storeService, match.params.name]);



  const filterAddBrandHandler = (e, item) => {
    if (e.target.checked) {
      filterAddBrand(item);
    } else {
      filterRemoveBrand(item);
    }
  };
  const filterAddCategoriesHandler = (e, item) => {
    if (e.target.checked) {
      filterAddCategories(item);
    } else {
      filterRemoveCategory(item);
    }
  };
  const filterAddColorHandler = (e, item) => {
    if (e.target.checked) {
      filterAddColor(item);
    } else {
      filterRemoveColor(item);
    }
  };
  const showHandler = () => {
    setIsVisible(!isVisible)
  }

  const filterOptions = [
    {
      items: getBrands,
      type: 'brand',
      handler: filterAddBrandHandler,
    },
    {
      items: getCategories,
      type: 'category',
      handler: filterAddCategoriesHandler,
    },
    {
      items: getColors,
      type: 'color',
      handler: filterAddColorHandler,
    },
  ]
  const itemsToShow = filterOptions.map(({ items, type, handler }) => {
    return <FilterItem
      key={type}
      items={items}
      type={type}
      handler={handler}
    />
  })
  return (
    <div>
      <Button variant="dark" className={`filter-button ${buttonClass}`} onClick={showHandler}></Button>
      <div className={`filter-group ${showFilterClass}`}>
        <span className="filter-title">Filters</span>
        {itemsToShow}
      </div>
    </div>
  );
};

const mapDispatchToProps = {
  filterAddBrand,
  filterAddColor,
  filterAddCategories,
  filterRemoveBrand,
  filterRemoveCategory,
  filterRemoveColor,
};

export default withStoreService()(
  connect(null, mapDispatchToProps)(withRouter(Filter))
);
