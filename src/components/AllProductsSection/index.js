import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'

import FiltersGroup from '../FiltersGroup'
import ProductCard from '../ProductCard'
import ProductsHeader from '../ProductsHeader'

import './index.css'

const categoryOptions = [
  {
    name: 'Clothing',
    categoryId: '1',
  },
  {
    name: 'Electronics',
    categoryId: '2',
  },
  {
    name: 'Appliances',
    categoryId: '3',
  },
  {
    name: 'Grocery',
    categoryId: '4',
  },
  {
    name: 'Toys',
    categoryId: '5',
  },
]

const sortbyOptions = [
  {
    optionId: 'PRICE_HIGH',
    displayText: 'Price (High-Low)',
  },
  {
    optionId: 'PRICE_LOW',
    displayText: 'Price (Low-High)',
  },
]

const ratingsList = [
  {
    ratingId: '4',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-four-stars-img.png',
  },
  {
    ratingId: '3',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-three-stars-img.png',
  },
  {
    ratingId: '2',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-two-stars-img.png',
  },
  {
    ratingId: '1',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-one-star-img.png',
  },
]

const apiStatusText = {
  initial: 'INITIAL',
  loading: 'LOADING',
  success: 'SUCCESS',
  noProducts: 'NO_PRODUCTS',
  failure: 'FAILURE',
}

class AllProductsSection extends Component {
  state = {
    productsList: [],
    activeOptionId: sortbyOptions[0].optionId,
    titleSearch: '',
    category: '',
    rating: '',
    apiStatus: apiStatusText.initial,
  }

  componentDidMount() {
    this.getProducts()
  }

  getProducts = async () => {
    this.setState({
      apiStatus: apiStatusText.loading,
    })
    const jwtToken = Cookies.get('jwt_token')

    // TODO: Update the code to get products with filters applied

    const {activeOptionId, titleSearch, category, rating} = this.state
    let queryParams = ''
    if (titleSearch !== '' && category !== '' && rating !== '') {
      queryParams = `title_search=${titleSearch}&category=${category}&rating=${rating}`
    } else if (titleSearch !== '' && category !== '') {
      queryParams = `title_search=${titleSearch}&category=${category}`
    } else if (titleSearch !== '' && rating !== '') {
      queryParams = `title_search=${titleSearch}&rating=${rating}`
    } else if (rating !== '' && category !== '') {
      queryParams = `rating=${rating}&category=${category}`
    } else if (titleSearch !== '') {
      queryParams = `title_search=${titleSearch}`
    } else if (category !== '') {
      queryParams = `category=${category}`
    } else if (rating !== '') {
      queryParams = `rating=${rating}`
    }
    const apiUrl = `https://apis.ccbp.in/products?sort_by=${activeOptionId}&${queryParams}`
    console.log(apiUrl)

    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    if (response.ok === true) {
      const fetchedData = await response.json()
      const updatedData = fetchedData.products.map(product => ({
        title: product.title,
        brand: product.brand,
        price: product.price,
        id: product.id,
        imageUrl: product.image_url,
        rating: product.rating,
      }))
      if (updatedData.length === 0) {
        this.setState({apiStatus: apiStatusText.noProducts})
      } else {
        this.setState({
          productsList: updatedData,
          apiStatus: apiStatusText.success,
        })
      }
    } else if (response.status === 401) {
      this.setState({apiStatus: apiStatusText.failure})
    }
  }

  changeSortby = activeOptionId => {
    this.setState({activeOptionId}, this.getProducts)
  }

  changeCategory = categoryId => {
    this.setState({category: categoryId}, this.getProducts)
  }

  changeRating = ratingId => {
    this.setState({rating: ratingId}, this.getProducts)
  }

  changeSearchInput = searchInput => {
    this.setState({titleSearch: searchInput})
  }

  submitInputForm = () => {
    this.getProducts()
  }

  resetFilters = () => {
    this.setState({category: '', rating: '', titleSearch: ''}, this.getProducts)
  }

  renderProductsList = () => {
    const {productsList, activeOptionId} = this.state

    // TODO: Add No Products View
    return (
      <div className="all-products-container">
        <ProductsHeader
          activeOptionId={activeOptionId}
          sortbyOptions={sortbyOptions}
          changeSortby={this.changeSortby}
        />
        <ul className="products-list">
          {productsList.map(product => (
            <ProductCard productData={product} key={product.id} />
          ))}
        </ul>
      </div>
    )
  }

  renderLoader = () => (
    <div className="products-loader-container">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  // TOD0: Add failure view
  renderFailureView = () => (
    <div className="failure-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz/nxt-trendz-products-error-view.png"
        alt="products failure"
        className="failure-image"
      />
      <h1 className="failure-heading">Oops! Something Went Wrong</h1>
      <p className="failure-desc">
        We are having some trouble processing your request. Please try again.
      </p>
    </div>
  )

  renderNoProductsFound = () => (
    <div className="failure-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz/nxt-trendz-no-products-view.png"
        alt="no products"
        className="failure-image"
      />
      <h1 className="failure-heading">No Products Found</h1>
      <p className="failure-desc">
        We could not find any products. Try other filters.
      </p>
    </div>
  )

  renderContentBasedOnApiStatus = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusText.loading:
        return this.renderLoader()
      case apiStatusText.noProducts:
        return this.renderNoProductsFound()
      case apiStatusText.failure:
        return this.renderFailureView()
      case apiStatusText.success:
        return this.renderProductsList()
      default:
        return null
    }
  }

  render() {
    const {category, rating, titleSearch} = this.state

    return (
      <div className="all-products-section">
        {/* TODO: Update the below element */}
        <FiltersGroup
          ratingsList={ratingsList}
          categoryOptions={categoryOptions}
          changeRating={this.changeRating}
          changeCategory={this.changeCategory}
          changeSearchInput={this.changeSearchInput}
          resetFilters={this.resetFilters}
          submitInputForm={this.submitInputForm}
          category={category}
          titleSearch={titleSearch}
          rating={rating}
        />
        {this.renderContentBasedOnApiStatus()}
      </div>
    )
  }
}

export default AllProductsSection
