const Product = require("../models/productModel");
const ErrorHandler = require("../utils/errorhander");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ApiFeatures = require("../utils/apifeatures");
const cloudinary = require("cloudinary");
const multer = require("multer");

const path = require("path");
const fs = require("fs");


// Create Product -- Admin
// Old Code
// exports.createProduct = async (req, res, next) => {
//     const product = await Product.create(req.body);
//     res.status(200).json({
//         success: true,
//         product
//     })
// }
exports.createProduct = catchAsyncErrors(async (req, res, next) => {
  let images = [];

  if (typeof req.body.images === "string") {
    images.push(req.body.images);
  } else {
    images = req.body.images;
  }

  const imagesLinks = [];

  for (let i = 0; i < images.length; i++) {
    const result = await cloudinary.v2.uploader.upload(images[i], {
      folder: "products",
    });

    imagesLinks.push({
      public_id: result.public_id,
      url: result?.secure_url,
    });
  }

  req.body.images = imagesLinks;
  req.body.user = req.user.id;

  const product = await Product.create(req.body);

  res.status(201).json({
    success: true,
    product,
  });
});




  

// Get All Products
// Old Code
// exports.getAllProducts = async (req, res) => {
    
//     const products = await Product.find();
//     res.status(200).json({
//         success: true,
//         products
//     })
// }
exports.getAllProducts = catchAsyncErrors(async (req, res, next) => {
    const resultPerPage = 8;
    const productsCount = await Product.countDocuments();

    const apiFeature = new ApiFeatures(Product.find(), req.query)
        .search() 
        .filter(); 
    apiFeature.pagination(resultPerPage); 

    let products = await apiFeature.query;

 
    const filteredProductsCount = await Product.countDocuments(apiFeature.query.getFilter()); 

    res.status(200).json({
        success: true,
        products,
        productsCount,
        resultPerPage,
        filteredProductsCount,
    });
});

// Get All Product (Admin)
// exports.getAdminProducts = catchAsyncErrors(async (req, res, next) => {
//     const products = await Product.find();
  
//     res.status(200).json({
//       success: true,
//       products,
//     });
//   });

exports.getAdminProducts = catchAsyncErrors(async (req, res, next) => {
  try {
    // Sorting by createdAt in descending order
    const products = await Product.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return next(new ErrorHandler("Failed to retrieve products", 500));
  }
});




// Update Product -- Admin
// Old Code
// exports.updateProduct = async (req, res, next) => {
    
//     let product = await Product.findById(req.params.id);

//     if(!product) {
//         return res.status(500).json({
//             success: false,
//             message: "Product Not Found"
//         })
//     }

//     product = await Product.findByIdAndUpdate(req.params.id, req.body, {
//         new: true,
//         runValidators: true,
//         useFindAndModify: false
//     })
//     res.status(200).json({
//         success: true,
//         product
//     })
// }
exports.updateProduct = catchAsyncErrors(async (req, res, next) => {
    let product = await Product.findById(req.params.id);
  
    if (!product) {
      return next(new ErrorHandler("Product not found", 404));
    }
  
    // Images Start Here
    let images = [];
  
    if (typeof req.body.images === "string") {
      images.push(req.body.images);
    } else {
      images = req.body.images;
    }
  
    if (images !== undefined) {
      // Deleting Images From Cloudinary
      for (let i = 0; i < product.images.length; i++) {
        await cloudinary.v2.uploader.destroy(product.images[i].public_id);
      }
  
      const imagesLinks = [];
  
      for (let i = 0; i < images.length; i++) {
        const result = await cloudinary.v2.uploader.upload(images[i], {
          folder: "products",
        });
  
        imagesLinks.push({
          public_id: result.public_id,
          url: result.secure_url,
        });
      }
  
      req.body.images = imagesLinks;
    }
  
    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });
  
    res.status(200).json({
      success: true,
      product,
    });
  });

// Get Product Details
// Old Code
// exports.getProductDetails = async (req, res, next) => {    
//     const product = await Product.findById(req.params.id);

//     if(!product) {
//         return res.status(500).json({
//             success: false,
//             message: "Product Not Found"
//         })
//     }

//     res.status(200).json({
//         success: true,
//         product
//     })
// }
exports.getProductDetails = catchAsyncErrors(async (req, res, next) => {
    const product = await Product.findById(req.params.id);

    if(!product) {
        return next(new ErrorHandler("Product Not Found", 404))
    }

    res.status(200).json({
        success: true,
        product
    })
})


// Delete Product -- Admin
// Old Code
// exports.deleteProduct = async (req, res, next) => {
    
//     const product = await Product.findById(req.params.id);

//     if(!product) {
//         return res.status(500).json({
//             success: false,
//             message: "Product Not Found"
//         })
//     }

//     await product.deleteOne();
//     res.status(200).json({
//         success: true,  
//         message: "Product Deleted Successfully"
//     })
// }
exports.deleteProduct = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorHander("Product not found", 404));
  }

  // Deleting Images From Cloudinary
  for (let i = 0; i < product.images.length; i++) {
    const { public_id } = product.images[i];
    if (public_id) {
      await cloudinary.v2.uploader.destroy(public_id);
    } else {
      console.error("Missing public_id for image:", product.images[i]);
    }
  }

  await Product.deleteOne({ _id: req.params.id });

  res.status(200).json({
    success: true,
    message: "Product deleted successfully",
  });
});

// Create New Review or Update the review
exports.createProductReview = catchAsyncErrors(async (req, res, next) => {
    const { rating, comment, productId } = req.body;

    const review = {
        user: req.user._id,
        name: req.user.name,
        rating: Number(rating),
        comment,
    }

    const product = await Product.findById(productId);

    const isReviewed = product.reviews.find(
        (rev) => rev.user.toString() === req.user._id.toString()
    )

    if(isReviewed) {
        product.reviews.forEach((rev) => {
            if(rev.user.toString() === req.user._id.toString()) {
                rev.rating = rating;
                rev.comment = comment;
            }
        })
    } else {
        product.reviews.push(review);
        product.numOfReviews = product.reviews.length;
    }

    let avg = 0;
    
    product.reviews.forEach((rev) => {
        avg += rev.rating;
    })

    product.ratings = avg / product.reviews.length;

    await product.save({ validateBeforeSave: false });

    res.status(200).json({
        success: true
    })
})

// Get All Reviews of a single product
exports.getProductReviews = catchAsyncErrors(async (req, res, next) => {
    const product = await Product.findById(req.query.id);

    res.status(200).json({
        success: true,
        reviews: product.reviews
    })
})

// Delete Review
exports.deleteReview = catchAsyncErrors(async (req, res, next) => {
    const product = await Product.findById(req.query.productId);

    const reviews = product.reviews.filter(
        (rev) => rev._id.toString() !== req.query.id.toString()
    )

    let avg = 0;

    reviews.forEach((rev) => {
        avg += rev.rating;
    })

    let ratings = 0;

    if(reviews.length === 0) {
        ratings = 0;
    } else {
        ratings = avg / reviews.length;
    }

    const numOfReviews = reviews.length;

    await Product.findByIdAndUpdate(req.query.productId, {
        reviews,
        ratings,
        numOfReviews
    }, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    })

    res.status(200).json({
        success: true
    })
})