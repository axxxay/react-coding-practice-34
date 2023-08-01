import {BsSearch} from 'react-icons/bs'
import './index.css'

const FiltersGroup = props => {
  const {
    ratingsList,
    categoryOptions,
    changeCategory,
    changeRating,
    changeSearchInput,
    resetFilters,
    submitInputForm,
    category,
    titleSearch,
    rating,
  } = props
  const onChangeInput = event => {
    changeSearchInput(event.target.value)
  }

  const onSubmitInput = event => {
    event.preventDefault()
    submitInputForm()
  }

  return (
    <div className="filters-group-container">
      <form className="input-con" onSubmit={onSubmitInput}>
        <input
          type="search"
          className="search-input"
          placeholder="Search"
          value={titleSearch}
          onChange={onChangeInput}
        />
        <BsSearch className="search-icon" />
      </form>
      <h1 className="category-heading">Category</h1>
      <ul className="category-list">
        {categoryOptions.map(eachCategory => {
          const activeClass =
            eachCategory.categoryId === category ? 'activeClass' : ''
          return (
            <li onClick={() => changeCategory(eachCategory.categoryId)}>
              <p className={`category-item ${activeClass}`}>
                {eachCategory.name}
              </p>
            </li>
          )
        })}
      </ul>
      <p className="category-heading">Rating</p>
      <ul className="category-list">
        {ratingsList.map(eachRating => {
          const activeClass =
            eachRating.ratingId === rating ? 'activeClass' : ''
          return (
            <li
              className="rating-con"
              onClick={() => changeRating(eachRating.ratingId)}
            >
              <img
                src={eachRating.imageUrl}
                alt={eachRating.ratingId}
                className="rating-img"
              />
              <p className={`rating-text ${activeClass} `}>& up</p>
            </li>
          )
        })}
      </ul>
      <button
        type="button"
        className="reset-button"
        onClick={() => resetFilters()}
      >
        Clear Filters
      </button>
    </div>
  )
}
export default FiltersGroup
