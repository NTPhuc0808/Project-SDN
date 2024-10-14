const Order = require("../models/orderModel");
const Product = require("../models/productModel");
const ErrorHandler = require("../utils/errorhander");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");

// Create new Order
exports.newOrder = catchAsyncErrors(async (req, res, next) => {
    const {
      shippingInfo,
      orderItems,
      paymentInfo,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    } = req.body;
  
    const order = await Order.create({
      shippingInfo,
      orderItems,
      paymentInfo,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
      paidAt: Date.now(),
      user: req.user._id,
    });
  
    res.status(201).json({
      success: true,
      order,
    });
  });

// Get Single Order
exports.getSingleOrder = catchAsyncErrors(async (req, res, next) => {
    const order = await Order.findById(req.params.id).populate(
      "user",
      "name email"
    );
  
    if (!order) {
      return next(new ErrorHander("Order not found with this Id", 404));
    }
  
    res.status(200).json({
      success: true,
      order,
    });
  });

// Get LoggedIn User Orders
exports.myOrders = catchAsyncErrors(async (req, res, next) => {
    const orders = await Order.find({ user: req.user._id });
  
    res.status(200).json({
      success: true,
      orders,
    });
  });


// Get All Orders -- Admin
exports.getAllOrders = catchAsyncErrors(async (req, res, next) => {
    const orders = await Order.find();
  
    let totalAmount = 0;
  
    orders.forEach((order) => {
      totalAmount += order.totalPrice;
    });
  
    res.status(200).json({
      success: true,
      totalAmount,
      orders,
    });
  });


// Update Order Status -- Admin
exports.updateOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
      return next(new ErrorHandler("Order not found with this Id", 404));
  }

  if (order.orderStatus === "Delivered") {
      return next(new ErrorHandler("You have already delivered this order", 400));
  }

  if (req.body.status === "Shipped") {
      // Kiểm tra stock trước khi cập nhật
      const stockSufficient = await checkStock(order.orderItems);
      if (!stockSufficient) {
          return next(new ErrorHandler("Not enough stock to fulfill the order", 400));
      }

      order.orderItems.forEach(async (o) => {
          await updateStock(o.product, o.quantity);
      });
  }

  order.orderStatus = req.body.status;

  if (req.body.status === "Delivered") {
      order.deliveredAt = Date.now();
  }

  await order.save({ validateBeforeSave: false });
  res.status(200).json({
      success: true,
  });
});

async function updateStock(id, quantity) {
  const product = await Product.findById(id);
  product.Stock -= quantity;
  await product.save({ validateBeforeSave: false });
}

// Hàm kiểm tra stock
async function checkStock(orderItems) {
  for (let item of orderItems) {
      const product = await Product.findById(item.product);
      if (product.Stock < item.quantity) {
          return false; // Không đủ stock
      }
  }
  return true; // Đủ stock cho tất cả các sản phẩm
}



// Delete Order -- Admin
// exports.deleteOrder = catchAsyncErrors(async (req, res, next) => {
//     const order = await Order.findById(req.params.id);

//     if (!order) {
//         return next(new ErrorHandler("Order not found with this Id", 404));
//     }

//     order.isDeleted = true;

//     const stockUpdatePromises = order.orderItems.map(item => updatePlusStock(item.product, item.quantity));
//     await Promise.all(stockUpdatePromises);

//     await order.save();

//     res.status(200).json({
//         success: true,
//         message: "Order successfully deleted",
//     });
// });

exports.deleteOrder = catchAsyncErrors(async (req, res, next) => {
    const order = await Order.findById(req.params.id);
  
    if (!order) {
      return next(new ErrorHander("Order not found with this Id", 404));
    }
  
    await order.deleteOne();
  
    res.status(200).json({
      success: true,
    });
  });

// async function updatePlusStock(id, quantity) {
//     const product = await Product.findById(id);
//     if (product) {
//         product.Stock += quantity;
//         await product.save({ validateBeforeSave: false });
//     }
// }
