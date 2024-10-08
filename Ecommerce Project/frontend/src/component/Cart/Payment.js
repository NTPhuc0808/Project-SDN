// import React, { Fragment, useEffect, useRef } from "react";
// import CheckoutSteps from "../Cart/CheckoutSteps";
// import { useSelector, useDispatch } from "react-redux";
// import MetaData from "../layout/MetaData";
// import { Typography } from "@material-ui/core";
// import { useAlert } from "react-alert";
// import axios from "axios";
// import "./Payment.css";
// import { createOrder, clearErrors } from "../../actions/orderAction";
// import { clearCart } from "../../actions/cartAction"; // Import clearCart
// import { useNavigate } from "react-router-dom";

// const Payment = () => {
//   const orderInfo = JSON.parse(sessionStorage.getItem("orderInfo"));

//   const dispatch = useDispatch();
//   const alert = useAlert();
//   const navigate = useNavigate();
//   const payBtn = useRef(null);

//   const { shippingInfo, cartItems } = useSelector((state) => state.cart);
//   const { user } = useSelector((state) => state.user);
//   const { error } = useSelector((state) => state.newOrder);

//   const order = {
//     shippingInfo,
//     orderItems: cartItems,
//     itemsPrice: orderInfo.subtotal,
//     taxPrice: orderInfo.tax,
//     shippingPrice: orderInfo.shippingCharges,
//     totalPrice: orderInfo.totalPrice,
//   };

//   const submitHandler = async (e) => {
//     e.preventDefault();

//     payBtn.current.disabled = true;

//     try {
//       const config = {
//         headers: {
//           "Content-Type": "application/json",
//         },
//       };

//       const paymentData = {
//         amount: Math.round(orderInfo.totalPrice * 100),
//         paymentMethod: "COD", // Adding payment method
//       };

//       const { data } = await axios.post(
//         "/api/v1/payment/process",
//         paymentData,
//         config
//       );

//       // Add paymentInfo to the order
//       order.paymentInfo = {
//         id: "COD",
//         status: "Pending",
//       };

//       dispatch(createOrder(order));
//       // dispatch(clearCart()); // Clear the cart after creating the order
//       navigate("/success");
      
//     } catch (error) {
//       payBtn.current.disabled = false;
//       alert.error(error.response.data.message);
//     }
//   };

//   useEffect(() => {
//     if (error) {
//       alert.error(error);
//       dispatch(clearErrors());
//     }
//   }, [dispatch, error, alert]);

//   return (
//     <Fragment>
//       <MetaData title="Payment" />
//       <CheckoutSteps activeStep={2} />
//       <div className="paymentContainer">
//         <form className="paymentForm" onSubmit={submitHandler}>
//           <Typography>Select Payment Method</Typography>
//           <div>
//             <label>Cash on Delivery</label>
//           </div>

//           <input
//             type="submit"
//             value={`Pay - ₹${orderInfo && orderInfo.totalPrice}`}
//             ref={payBtn}
//             className="paymentFormBtn"
//           />
//         </form>
//       </div>
//     </Fragment>
//   );
// };

// export default Payment;
import React, { Fragment, useEffect, useRef } from "react";
import CheckoutSteps from "../Cart/CheckoutSteps";
import { useSelector, useDispatch } from "react-redux";
import MetaData from "../layout/MetaData";
import { Typography } from "@material-ui/core";
import { useAlert } from "react-alert";
import axios from "axios";
import "./Payment.css";
import { createOrder, clearErrors } from "../../actions/orderAction";
import { clearCart } from "../../actions/cartAction"; // Import clearCart
import { useNavigate } from "react-router-dom";

const Payment = () => {
  const orderInfo = JSON.parse(sessionStorage.getItem("orderInfo"));

  const dispatch = useDispatch();
  const alert = useAlert();
  const navigate = useNavigate();
  const payBtn = useRef(null);

  const { shippingInfo, cartItems } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.user);
  const { error } = useSelector((state) => state.newOrder);

  const order = {
    shippingInfo,
    orderItems: cartItems,
    itemsPrice: orderInfo.subtotal,
    taxPrice: orderInfo.tax,
    shippingPrice: orderInfo.shippingCharges,
    totalPrice: orderInfo.totalPrice,
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    payBtn.current.disabled = true;

    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      const paymentData = {
        amount: Math.round(orderInfo.totalPrice * 100),
        paymentMethod: "COD", 
      };

      const { data } = await axios.post(
        "/api/v1/payment/process",
        paymentData,
        config
      );

      order.paymentInfo = {
        id: data.id || "COD", 
        status: "Pending",
      };

      await dispatch(createOrder(order)); 
      navigate("/success"); 
      
    } catch (error) {
      payBtn.current.disabled = false;
      alert.error(error.response.data.message);
    }
  };

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearCart());
      dispatch(clearErrors());
    }
  }, [dispatch, error, alert]);

  return (
    <Fragment>
      <MetaData title="Payment" />
      <CheckoutSteps activeStep={2} />
      <div className="paymentContainer">
        <form className="paymentForm" onSubmit={submitHandler}>
          <Typography>Select Payment Method</Typography>
          <div>
            <label>Cash on Delivery</label>
          </div>

          <input
            type="submit"
            value={`Pay - ₹${orderInfo && orderInfo.totalPrice}`}
            ref={payBtn}
            className="paymentFormBtn"
          />
        </form>
      </div>
    </Fragment>
  );
};

export default Payment;

