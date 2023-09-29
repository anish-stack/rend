const products = require("../modals/productModal");
const ApiFeature = require("../utils/apiFeaturess");
const ErrorHander = require("../utils/errorHandler");

const catchAsyncErrors = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
//  create products  for admin=========================================

exports.createProduct = catchAsyncErrors(async (req, res, next) => {
  try {
    const product = await products.create(req.body);

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    // Handle any errors that occur during product creation
    console.error("Error creating product:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create product.",
    });
  }
});

//  create products  for admin=========================================

exports.getAllProducts = catchAsyncErrors(async (req, res, next) => {
  const resultPerPage = 150; // Change this to 8 images per page
  const apifeature = new ApiFeature(products.find(req.query), req.query)
    .search()
    .filter()
    .pagination(resultPerPage);

  try {
    const allProducts = await apifeature.query; // Query products from the database

    res.status(200).json({
      success: true,
      data: allProducts,
    });
  } catch (error) {
    console.error("An error occurred:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch products.",
      error: error.message,
    });
  }
});

// ======================Update product for admin

exports.updateProduct = catchAsyncErrors(async (req, res, next) => {
  try {
    const productId = req.params.id;
    const updateData = req.body;

    // Find the product by ID and update it with the new data
    const updatedProduct = await products.findByIdAndUpdate(
      productId,
      updateData,
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    res.status(200).json({
      success: true,
      data: updatedProduct,
    });
    console.log(updatedProduct);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update product.",
      error: error.message,
    });
  }
});

//   ===========================Delete products by id
exports.deleteProduct = catchAsyncErrors(async (req, res, next) => {
  const product = await products.findById(req.params.id);

  if (!product) {
    return next(new ErrorHander("Product not found", 404));
  }

  await product.deleteOne();

  res.status(200).json({
    success: true,
    message: "Product Delete Successfully",
  });
});

//  ===========================single  products by id

exports.gettSingleProducts = catchAsyncErrors(async (req, res, next) => {
  const product = await products.findById(req.params.id);

  if (!product) {
    return res.status(500).json({
      success: false,
      message: "No Product Found",
    });
  }

  res.status(200).json({
    success: true,
    product,
  });
});
exports.FilterProductsByKeywords = catchAsyncErrors(async (req, res) => {
  try {
    const { keywords } = req.params;

    // Check if the 'keywords' parameter is missing or empty
    if (!keywords || keywords.trim() === '') {
      return res.status(400).json({
        success: false,
        message: "Keywords are required.",
      });
    }

    const keywordArray = keywords.split(" ");

    // Construct a regular expression pattern to match the keywords in both category and name
    const regexPattern = keywordArray.map(keyword => `(?=.*${keyword})`).join('');

    // Create a regex object
    const regex = new RegExp(regexPattern, 'i'); // 'i' for case-insensitive matching

    // Query for products with names, categories, or keywords matching the regex pattern
    const productsMatchingKeywords = await products.find({
      $or: [
        { name: regex },
        { category: regex },
        { keywords: { $in: keywordArray } } // Match products with any of the provided keywords
      ]
    }).exec();

    if (productsMatchingKeywords.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No products found with the specified keywords.",
      });
    }

    res.status(200).json({
      success: true,
      products: productsMatchingKeywords,
    });
  } catch (error) {
    console.error("Error filtering products by keywords:", error);
    res.status(500).json({
      success: false,
      message: "Failed to filter products by keywords.",
    });
  }
});




exports.searchProducts = async (req, res) => {
  try {
    const { keyword } = req.params;

    // Check if the 'keyword' parameter is missing or empty
    if (!keyword || keyword.trim() === '') {
      return res.status(400).json({
        success: false,
        message: "Keyword is required.",
      });
    }

    // Create a regex pattern for the keyword
    const regexPattern = new RegExp(keyword, 'i'); // 'i' for case-insensitive matching

    // Query for products with names, categories, or keywords matching the regex pattern
    const productsMatchingKeyword = await products.find({
      $or: [
        { name: regexPattern },
        { category: regexPattern },
        { keywords: { $in: [regexPattern] } }, // Match keywords exactly
      ]
    }).exec();

    if (productsMatchingKeyword.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No products found with the specified keyword.",
      });
    }

    res.status(200).json({
      success: true,
      products: productsMatchingKeyword,
    });
  } catch (error) {
    console.error("Error searching products:", error);
    res.status(500).json({
      success: false,
      message: "Failed to search products.",
    });
  }
};
