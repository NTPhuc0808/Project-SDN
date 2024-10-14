import React, { Fragment, useEffect, useState } from "react";
import { CgMouse } from "react-icons/cg";
import "./Home.css";
import ProductCard from "./ProductCard.js";
import MetaData from "../layout/MetaData";
import { clearErrors, getProduct } from "../../actions/productAction";
import { useSelector, useDispatch } from "react-redux";
import Loader from "../layout/Loader/Loader";
import { useAlert } from "react-alert";
import { useParams } from "react-router-dom";  
import Pagination from "react-js-pagination";

const Home = () => {
  const alert = useAlert();
  const dispatch = useDispatch();
  const { 
    loading, 
    error, 
    products, 
    productsCount, 
    resultPerPage, 
    filteredProductsCount, 
  } = useSelector((state) => state.products);

  const [currentPage, setCurrentPage] = useState(1);  
  const setCurrentPageNo = (e) => {
    setCurrentPage(e);
  };

  let count = filteredProductsCount;  
  const { category } = useParams(); 


  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
    
    dispatch(getProduct(category, currentPage));  
  }, [dispatch, error, alert, category, currentPage]); 


  const sortedProducts = products ? 
    [...products].sort((a, b) => {
      if (!a.createdAt || !b.createdAt) return 0;  
      return new Date(b.createdAt) - new Date(a.createdAt); 
    }) : [];


  const filteredSortedProducts = sortedProducts.filter(product => product.ratings > 0);

  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <MetaData title="ECOMMERCE" />

          <div className="banner">
            <p>Welcome to Ecommerce</p>
            <h1>FIND AMAZING PRODUCTS BELOW</h1>

            <a href="#container">
              <button>
                Scroll <CgMouse />
              </button>
            </a>
          </div>

          <h2 className="homeHeading">Featured Products</h2>

          <div className="container" id="container">
            {filteredSortedProducts && filteredSortedProducts.length > 0 ? (
              filteredSortedProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))
            ) : (
              <p>No products available with ratings.</p>
            )}
          </div>

          {/* Show Pagination if the resultPerPage is less than total count */}
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

export default Home;
