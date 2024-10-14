import React, { Fragment, useEffect, useState } from "react";
import "./Products.css";
import { useSelector, useDispatch } from "react-redux";
import { clearErrors, getProduct } from "../../actions/productAction";
import Loader from "../layout/Loader/Loader";
import ProductCard from "../Home/ProductCard";
import Pagination from "react-js-pagination";
import Slider from "@material-ui/core/Slider";
import { useAlert } from "react-alert";
import Typography from "@material-ui/core/Typography";
import MetaData from "../layout/MetaData";
import { useParams, useNavigate } from "react-router-dom";

const categories = [
  "Bánh quy",
  "Bánh gạo",
  "Bánh quế",
  "Bánh snack, rong biển",
  "Bánh Chocopie",
  "Bánh bông lan",
  // "Bánh tươi, Sandwich",
  // "Socola",
  // "Bánh que",
  // "Kẹo cứng",
  // "Kẹo dẻo, kẹo marshmallow",
  // "Kẹo singum",
  // "Trái cây sấy",
  // "Hạt khô",
  // "Rau câu, thạch dừa",
  // "Mứt trái cây",
  // "Cơm cháy, bánh tráng",
  // "Bánh xốp"
];

const Products = () => {
  const { keyword: keywordFromURL } = useParams(); 
  const dispatch = useDispatch();
  const alert = useAlert();
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);
  const [price, setPrice] = useState([0, 100000]);
  const [category, setCategory] = useState("");
  const [ratings, setRatings] = useState(0);
  const [keyword, setKeyword] = useState(keywordFromURL || ""); 

  const {
    products,
    loading,
    error,
    productsCount,
    resultPerPage,
    filteredProductsCount,
  } = useSelector((state) => state.products);

  const setCurrentPageNo = (e) => {
    setCurrentPage(e);
  };

  const priceHandler = (event, newPrice) => {
    setPrice(newPrice);
  };

 
  const searchSubmitHandler = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      navigate(`/products/${keyword}`); 
    } else {
      navigate("/products"); 
    }
  };

  let count = filteredProductsCount;

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }

    dispatch(getProduct(keywordFromURL, currentPage, price, category, ratings));
  }, [dispatch, keywordFromURL, currentPage, price, category, ratings, alert, error]);

  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <MetaData title="PRODUCTS -- ECOMMERCE" />

          {/* Search Box */}
          <form className="search" onSubmit={searchSubmitHandler}>
            <input
              type="text"
              placeholder="Search a Product ..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)} 
            />
            <input type="submit" value="Search" />
          </form>

          <h2 className="productsHeading">Products</h2>

          <div className="products">
            {products && products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>

          <div className="filterBox">
            <Typography>Price</Typography>
            <Slider
              value={price}
              onChange={priceHandler}
              valueLabelDisplay="auto"
              aria-labelledby="range-slider"
              min={0}
              max={900000}
            />
            <Typography>Categories</Typography>
            <ul className="categoryBox">
              {categories.map((category) => (
                <li
                  className="category-link"
                  key={category}
                  onClick={() => setCategory(category)}
                >
                  {category}
                </li>
              ))}
            </ul>
            <fieldset>
              <Typography component="legend">Ratings Above</Typography>
              <Slider
                value={ratings}
                onChange={(e, newRating) => {
                  setRatings(newRating);
                }}
                aria-labelledby="continuous-slider"
                valueLabelDisplay="auto"
                min={0}
                max={5}
              />
            </fieldset>
          </div>

          {resultPerPage < count && (
            <div className="paginationBox">
              <Pagination
                activePage={currentPage}
                itemsCountPerPage={resultPerPage}
                totalItemsCount={productsCount}
                onChange={setCurrentPageNo}
                nextPageText="Next"
                prevPageText="Prev"
                firstPageText="1st"
                lastPageText="Last"
                itemClass="page-item"
                linkClass="page-link"
                activeClass="pageItemActive"
                activeLinkClass="pageLinkActive"
              />
            </div>
          )}
        </Fragment>
      )}
    </Fragment>
  );
};

export default Products;