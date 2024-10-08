const catchAsyncErrors = require("../middleware/catchAsyncErrors");

exports.processPayment = catchAsyncErrors(async (req, res, next) => {
  
  const paymentMethod = req.body.paymentMethod; 

  if (paymentMethod === "COD") {
    return res.status(200).json({
      success: true,
      message: "Cash on Delivery selected. No online payment processing needed.",
    });
  } else {
    return res.status(400).json({
      success: false,
      message: "Invalid payment method selected or unsupported method.",
    });
  }
});
