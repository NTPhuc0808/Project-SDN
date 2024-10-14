import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import WebFont from 'webfontloader';
import Header from './component/layout/Header/Header';
import Footer from './component//layout/Footer/Footer';
import Home from './component/Home/Home';
import ProductDetails from './component/Product/ProductDetails';
import Products from './component/Product/Products';
import Search from "./component/Product/Search";
import LoginSignUp from './component/User/LoginSignUp';
import store from './store';
import { loadUser } from './actions/userAction';
import { useSelector } from 'react-redux';
import UserOptions from './component/layout/Header/UserOptions';
import Profile from './component/User/Profile';
import ProtectedRoute from './component/Route/ProtectedRoute';
import UpdateProfile from './component/User/UpdateProfile';
import UpdatePassword from './component/User/UpdatePassword';
import ForgotPassword from './component/User/ForgotPassword';
import ResetPassword from './component/User/ResetPassword';
import Cart from './component/Cart/Cart';
import Shipping from './component/Cart/Shipping';
import ConfirmOrder from './component/Cart/ConfirmOrder';
import Payment from './component/Cart/Payment';
import OrderSuccess from './component/Cart/OrderSuccess';
import MyOrders from './component/Order/MyOrders';
import OrderDetails from './component/Order/OrderDetails';
import Dashboard from './component/Admin/Dashboard';
import ProductList from './component/Admin/ProductList';
import NewProduct from './component/Admin/NewProduct';
import UpdateProduct from './component/Admin/UpdateProduct';
import UsersList from './component/Admin/UsersList';
import UpdateUser from './component/Admin/UpdateUser';
import OrderList from './component/Admin/OrderList';
import ProductReviews from './component/Admin/ProductReviews';
import ProcessOrder from './component/Admin/ProcessOrder';
import About from './component/layout/About/About';


function App() {

  const { isAuthenticated, user } = useSelector((state) => state.user);

  React.useEffect(() => {
    WebFont.load({
      google: {
        families: ["Roboto", "Droid Sans", "Chilanka"]
      }
    });
    
    store.dispatch(loadUser())
  }, []);

  return (
    <Router>
      <Header />
      {isAuthenticated && <UserOptions user={user} />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path='/about' element={<About />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:keyword?" element={<Products />} />
        <Route path="/search" element={<Search />} />
        <Route path="/login" element={<LoginSignUp />} />

        <Route path="/account" element={<ProtectedRoute element={Profile} />} />
        <Route path="/me/update" element={<ProtectedRoute element={UpdateProfile} />} />
        <Route path="/password/update" element={<ProtectedRoute element={UpdatePassword} />} />
        <Route path="/password/forgot" element={<ForgotPassword />} />
        <Route path='/password/reset/:token' element={<ResetPassword/>}/>

        <Route path="/cart" element={<Cart />} />
        <Route path="/shipping" element={<ProtectedRoute element={Shipping} />} />
        <Route path='/order/confirm' element={<ProtectedRoute element={ConfirmOrder} />} />
        <Route path='/process/payment' element={<ProtectedRoute element={Payment} />} />
        <Route path='/success' element={<ProtectedRoute element={OrderSuccess} />} />
        <Route path='/orders' element={<ProtectedRoute element={MyOrders} />} />
        <Route path='/order/:id' element={<ProtectedRoute element={OrderDetails} />} />

        <Route path='/admin/dashboard' element={<ProtectedRoute isAdmin={true} element={Dashboard} />} />
        <Route path='/admin/products' element={<ProtectedRoute isAdmin={true} element={ProductList} />} />
        <Route path='/admin/product' element={<ProtectedRoute isAdmin={true} element={NewProduct} />} />
        <Route path='/admin/product/:id' element={<ProtectedRoute isAdmin={true} element={UpdateProduct} />} />
        <Route path='/admin/users' element={<ProtectedRoute isAdmin={true} element={UsersList} />} />
        <Route path='/admin/user/:id' element={<ProtectedRoute isAdmin={true} element={UpdateUser} />} />
        <Route path='/admin/orders' element={<ProtectedRoute isAdmin={true} element={OrderList} />} />
        <Route path='/admin/reviews' element={<ProtectedRoute isAdmin={true} element={ProductReviews} />} />
        <Route path='/admin/order/:id' element={<ProtectedRoute isAdmin={true} element={ProcessOrder} />} />

      </Routes>
      <Footer />
    </Router>
  );
  
}

export default App;