import React, { Fragment, useEffect, useState } from "react";
import MetaData from "../layout/MetaData";
import { Link, useParams, useNavigate } from "react-router-dom"; 
import { Typography, Button } from "@mui/material";
import SideBar from "./Sidebar";
import {
  getOrderDetails,
  clearErrors,
  updateOrder,
} from "../../actions/orderAction";
import { useSelector, useDispatch } from "react-redux";
import Loader from "../layout/Loader/Loader";
import { useAlert } from "react-alert";
import AccountTreeIcon from "@mui/icons-material/AccountTree"; // Updated to use MUI icons correctly
import { UPDATE_ORDER_RESET } from "../../constants/orderConstants";
import "./ProcessOrder.css";

const ProcessOrder = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const alert = useAlert();

  const { order, error, loading } = useSelector((state) => state.orderDetails);
  const { error: updateError, isUpdated } = useSelector((state) => state.order);

  const [status, setStatus] = useState("");

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }

    if (updateError) {
      alert.error(updateError);
      dispatch(clearErrors());
    }

    if (isUpdated) {
      alert.success("Order Updated Successfully");
      dispatch({ type: UPDATE_ORDER_RESET });
      navigate(`/admin/order/${id}`);
    }

    if (id) {
      dispatch(getOrderDetails(id));
    }
  }, [dispatch, alert, error, id, isUpdated, updateError, navigate]);

  const updateOrderSubmitHandler = (e) => {
    e.preventDefault();
    
    const outOfStockItems = order.orderItems?.filter(item => item.quantity > item.stock);

    if (outOfStockItems.length > 0) {
      const productNames = outOfStockItems.map(item => item.name).join(", ");
      alert.error(`Cannot process order: The following items are out of stock: ${productNames}.`);
      return; 
    }
  
    const myForm = new FormData();
    myForm.set("status", status);
    dispatch(updateOrder(id, myForm));
  };

  const formatCurrency = (amount) => {
    return amount.toLocaleString('vi-VN') + ' VND'; // Format the amount
  };

  if (loading) {
    return <Loader />;
  }

  if (!order || !order.orderStatus) {
    return <div>No order found</div>;
  }

  return (
    <Fragment>
      <MetaData title="Process Order" />
      <div className="dashboard">
        <SideBar />
        <div className="newProductContainer">
          <div
            className="confirmOrderPage"
            style={{
              display: order.orderStatus === "Delivered" ? "block" : "grid",
            }}
          >
            <div>
              <div className="confirmshippingArea">
                <Typography>Shipping Info</Typography>
                <div className="orderDetailsContainerBox">
                  <div>
                    <p>Name:</p>
                    <span>{order.user?.name}</span>
                  </div>
                  <div>
                    <p>Phone:</p>
                    <span>{order.shippingInfo?.phoneNo}</span>
                  </div>
                  <div>
                    <p>Address:</p>
                    <span>
                      {order.shippingInfo &&
                        `${order.shippingInfo.address}, ${order.shippingInfo.city}, ${order.shippingInfo.state}`}
                    </span>
                  </div>
                </div>

                <Typography>Payment</Typography>
                <div className="orderDetailsContainerBox">
                  <div>
                    <p className={order.paymentInfo?.status === "succeeded" ? "greenColor" : "redColor"}>
                      {order.paymentInfo?.status === "succeeded" ? "PAID" : "NOT PAID"}
                    </p>
                  </div>
                  <div>
                    <p>Amount:</p>
                    <span>{formatCurrency(order.totalPrice)}</span> {/* Format the amount */}
                  </div>
                </div>

                <Typography>Order Status</Typography>
                <div className="orderDetailsContainerBox">
                  <div>
                    <p className={order.orderStatus === "Delivered" ? "greenColor" : "redColor"}>
                      {order.orderStatus}
                    </p>
                  </div>
                </div>
              </div>

              <div className="confirmCartItems">
                <Typography>Your Cart Items:</Typography>
                <div className="confirmCartItemsContainer">
                  {order.orderItems?.map((item) => (
                    <div key={item.product}>
                      <img src={item.image} alt="Product" />
                      <Link to={`/product/${item.product}`}>
                        {item.name}
                      </Link>{" "}
                      <span>
                        {item.quantity} X {formatCurrency(item.price)} ={" "} {/* Format the item price */}
                        <b>{formatCurrency(item.quantity * item.price)}</b> {/* Format the total for this item */}
                      </span>
                      {item.stock === 0 && (
                        <p className="outOfStockMessage">Out of Stock</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div
              style={{
                display: order?.orderStatus === "Delivered" ? "none" : "block",
              }}
            >
              <form
                className="updateOrderForm"
                onSubmit={updateOrderSubmitHandler}
              >
                <h1>Process Order</h1>

                <div>
                  <AccountTreeIcon />
                  <select onChange={(e) => setStatus(e.target.value)}>
                    <option value="">Choose Status</option>
                    {order.orderStatus === "Processing" && (
                      <option value="Shipped">Shipped</option>
                    )}
                    {order.orderStatus === "Shipped" && (
                      <option value="Delivered">Delivered</option>
                    )}
                  </select>
                </div>

                <Button
                  id="createProductBtn"
                  type="submit"
                  disabled={loading || !status}
                >
                  Process
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default ProcessOrder;
