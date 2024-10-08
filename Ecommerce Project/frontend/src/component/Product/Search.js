import React, { useState, Fragment } from "react";
import MetaData from "../layout/MetaData";
import "./Search.css";
import { useNavigate } from "react-router-dom"; // Updated import

const Search = () => {
  const [keyword, setKeyword] = useState("");
  const navigate = useNavigate(); // Replaced history with navigate

  const searchSubmitHandler = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      navigate(`/products/${keyword}`); // Updated history.push to navigate
    } else {
      navigate("/products");
    }
  };

  return (
    <Fragment>
      <MetaData title="Search A Product -- ECOMMERCE" />
      <form className="searchBox" onSubmit={searchSubmitHandler}>
        <input
          type="text"
          placeholder="Search a Product ..."
          onChange={(e) => setKeyword(e.target.value)}
        />
        <input type="submit" value="Search" />
      </form>
    </Fragment>
  );
};

export default Search;





// import React, { useState, Fragment } from "react";
// import MetaData from "../layout/MetaData";
// import "./Search.css";

// const Search = ({ history }) => {
//   const [keyword, setKeyword] = useState("");

//   const searchSubmitHandler = (e) => {
//     e.preventDefault();
//     if (keyword.trim()) {
//       history.push(`/products/${keyword}`);
//     } else {
//       history.push("/products");
//     }
//   };

//   return (
//     <Fragment>
//       <MetaData title="Search A Product -- ECOMMERCE" />
//       <form className="searchBox" onSubmit={searchSubmitHandler}>
//         <input
//           type="text"
//           placeholder="Search a Product ..."
//           onChange={(e) => setKeyword(e.target.value)}
//         />
//         <input type="submit" value="Search" />
//       </form>
//     </Fragment>
//   );
// };

// export default Search;
