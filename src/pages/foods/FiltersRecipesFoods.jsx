import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { func } from 'prop-types';
import { fetchCategoriesFoodsApi, fetchSearchFoodsApi } from '../../services/fetchApi';
import { fetchRecipesForCategory } from '../../redux/actions';
import getRecipes from '../../redux/actions/getRecipes';

function FiltersRecipesFoods({ getCategory, getRecipesNotFilter }) {
  const [categories, setCategories] = useState([]);
  const [isMouted, setisMouted] = useState(false);
  const [isToggle, setisToggle] = useState('');
  const [isFilteredCategory, setFilteredCategory] = useState(false);

  const getCategories = () => {
    const fetchCategories = async () => {
      const data = await fetchCategoriesFoodsApi();
      const FiveNumber = 5;
      const firstFivesCategories = data.filter((_item, index) => index < FiveNumber);
      setCategories(firstFivesCategories);
      setisMouted(true);
    };
    if (!isMouted) fetchCategories();
  };

  useEffect(getCategories);

  async function handleClick({ value }) {
    if (!isFilteredCategory || isToggle !== value) {
      getCategory(value);
      setFilteredCategory(true);
      return setisToggle(value);
    }
    const recipes = await fetchSearchFoodsApi('name', '');
    getRecipesNotFilter(recipes);
    setFilteredCategory(false);
  }

  async function setCategoryAll() {
    const recipes = await fetchSearchFoodsApi('name', '');
    getRecipesNotFilter(recipes);
    setFilteredCategory(false);
  }

  return (
    <>
      {categories.map(({ strCategory }) => (
        <button
          key={ strCategory }
          type="button"
          data-testid={ `${strCategory}-category-filter` }
          value={ strCategory }
          onClick={ ({ target }) => handleClick(target) }
        >
          {strCategory}
        </button>
      ))}
      <button
        type="button"
        data-testid="All-category-filter"
        onClick={ setCategoryAll }
      >
        All
      </button>
    </>
  );
}

const mapDispatchToProps = (dispatch) => ({
  getCategory: (category) => dispatch(fetchRecipesForCategory(category, true)),
  getRecipesNotFilter: (recipes) => dispatch(getRecipes(recipes)),
});

FiltersRecipesFoods.propTypes = {
  getCategory: func.isRequired,
  getRecipesNotFilter: func.isRequired,
};

export default connect(null, mapDispatchToProps)(FiltersRecipesFoods);
