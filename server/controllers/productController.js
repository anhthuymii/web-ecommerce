import slugify from "slugify";
import fs, { read } from "fs";
import productModel from "../models/productModel.js";
import categoryModel from "../models/categoryModel.js";
import dotenv from "dotenv";
import axios from "axios";
dotenv.config();

export const createProductController = async (req, res) => {
  try {
    const {
      name,
      slug,
      size,
      tag,
      brand,
      description,
      price,
      // regularPrice,
      category,
      quantity,
      shipping,
    } = req.fields;
    const { photo } = req.files;

    const requiredFields = [
      "name",
      "description",
      "price",
      "size",
      "tag",
      "brand",
      "category",
      "quantity",
    ];
    for (const field of requiredFields) {
      if (!req.fields[field]) {
        return res.status(500).send({ error: `Bắt buộc nhập ${field}` });
      }
    }
    const existingProduct = await productModel.findOne({ name });
    if (existingProduct) {
      return res.status(200).json({
        success: false,
        message: "Tên sản phẩm đã tồn tại. Hãy nhập tên sản phẩm khác",
      });
    }
    if (photo && photo.size > 1000000) {
      return res
        .status(500)
        .send({ error: "Ảnh bắt buộc và phải nhỏ hơn 1MB" });
    }

    const products = await productModel({ ...req.fields, slug: slugify(name) });
    if (photo) {
      products.photo.data = fs.readFileSync(photo.path);
      products.photo.contentType = photo.type;
    }
    console.log("Add products");
    await products.save();

    const productId = products._id.toString();
    const esServiceUrl = `${process.env.ES_APP_API}/es/${productId}`;

    const { data: esProduct } = await axios.post(esServiceUrl);

    res.status(201).json({
      success: true,
      message: "Sản phẩm được tạo thành công",
      products,
      esProduct,
    });

    // TODO : Use PUT request trigger ES service here
    // const productId = products.id.toString(); 60298402398429384
    // start es service at port localhost:8000
    // example: axios.post(`localhost:8000/api/es/${productId}`);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      error,
      message: "Lỗi xảy ra khi tạo sản phẩm",
    });
  }
};

export const getProductController = async (req, res) => {
  try {
    const {
      limit = 100,
      page = 1,
      sortTag,
      category,
      priceRange, // Use a single parameter for price range
      search,
    } = req.query;
    const skip = (page - 1) * limit;

    let query = {};

    // Check if sortTag is provided
    if (sortTag) {
      query.tag = sortTag;
    }

    // Check if category is provided
    if (category) {
      const categoryObj = await categoryModel.findOne({ slug: category });
      if (categoryObj) {
        query.category = categoryObj._id;
      }
    }

    // Check if priceRange is provided
    if (priceRange) {
      const [minPrice, maxPrice] = priceRange.split("-").map(Number);
      if (!isNaN(minPrice) && !isNaN(maxPrice)) {
        query.price = { $gte: minPrice, $lte: maxPrice };
      }
    }
    if (search) {
      query.name = { $regex: new RegExp(search, "i") };
    }

    const products = await productModel
      .find(query)
      .limit(parseInt(limit))
      .skip(skip)
      .populate("category")
      .select("-photo")
      .sort({ createdAt: -1 });

    const totalProduct = await productModel.countDocuments(query);

    res.status(200).send({
      success: true,
      countTotal: products.length,
      total: totalProduct,
      currentPage: parseInt(page),
      message: "All Products",
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in getting products",
      error: error.message,
    });
  }
};

//get single product
export const getSingleProductController = async (req, res) => {
  try {
    const product = await productModel
      .findOne({ slug: req.params.slug })
      .select("-photo")
      .populate("category");
    res.status(200).send({
      success: true,
      message: "Single product fetched",
      product,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while getting single product",
      error,
    });
  }
};

export const getProductByIdController = async (req, res) => {
  try {
    const product = await productModel.findById(req.params.productId);
    console.log("Product ID:", req.params.productId);

    if (product) {
      res.status(200).send({
        success: true,
        product,
      });
    } else {
      res.status(404).send({
        success: false,
        message: "Product not found with the provided ID",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while getting product details by ID",
      error,
    });
  }
};

//get photo
export const productPhotoController = async (req, res) => {
  try {
    const product = await productModel.findById(req.params.pid).select("photo");
    if (product && product.photo && product.photo.data) {
      res.set("Content-type", product.photo.contentType);
      return res.status(200).send(product.photo.data);
    } else {
      return res
        .status(404)
        .send({ success: false, message: "Photo not found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while getting photo",
      error,
    });
  }
};

export const deleteProductController = async (req, res) => {
  try {
    const products = await productModel
      .findByIdAndDelete(req.params.pid)
      .select("-photo");
    const productId = products._id.toString();
    const esServiceUrl = `${process.env.ES_APP_API}/es/${productId}`;
    console.log("Elasticsearch URL:", esServiceUrl);

    const { data: esProduct } = await axios
      .delete(esServiceUrl)
      .catch((error) => {
        if (error.response && error.response.status === 404) {
          console.log("Product not found in Elasticsearch");
          return { data: null };
        } else {
          throw error;
        }
      });
    console.log("Elasticsearch Delete Response:", esProduct);

    res.status(200).send({
      success: true,
      message: "Xóa sản phẩm thành công",
      esProduct,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Lỗi khi xóa sản phẩm",
      error,
    });
  }
};
//update
export const updateProductController = async (req, res) => {
  try {
    const productId = req.params.pid;
    const updateFields = req.fields;
    const { photo } = req.files;

    const existingProduct = await productModel.findById(productId);
    if (photo) {
      existingProduct.photo.data = fs.readFileSync(photo.path);
      existingProduct.photo.contentType = photo.type;
    }
    if (!existingProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found with the provided ID",
      });
    }

    // Update the product fields
    Object.assign(existingProduct, updateFields);

    // Save the updated product
    await existingProduct.save();
    const productIds = existingProduct._id.toString();
    const esServiceUrl = `${process.env.ES_APP_API}/es/${productIds}`;

    const { data: esProduct } = await axios.post(esServiceUrl);

    console.log("Cập nhật sản phẩm thành công");

    res.status(200).json({
      success: true,
      message: "Cập nhật sản phẩm thành công",
      updatedProduct: existingProduct,
      esProduct,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Lỗi xảy ra khi cập nhật sản phẩm",
      error,
    });
  }
};

//filters
export const productFiltersController = async (req, res) => {
  try {
    const { checked, radio } = req.body;
    let args = {};
    if (checked.length > 0) args.category = checked;
    // if (checked.length > 0) args.brand = checked;
    if (radio.length) args.price = { $gte: radio[0], $lte: radio[1] };
    const products = await productModel.find(args);
    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error while filtering products",
      error,
    });
  }
};

//product count
export const productCountController = async (req, res) => {
  try {
    const total = await productModel.find({}).estimatedDocumentCount();
    res.status(200).send({
      success: true,
      total,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      message: "Error in product count",
      error,
      success: false,
    });
  }
};

//search product
export const searchProductController = async (req, res) => {
  try {
    const { keyword } = req.params;
    const results = await productModel
      .find({
        $or: [
          { name: { $regex: keyword, $options: "i" } },
          { description: { $regex: keyword, $options: "i" } },
        ],
      })
      .select("-photo");
    res.json(results);
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error In Search Product API",
      error,
    });
  }
};

//similar products
export const relatedProductController = async (req, res) => {
  try {
    const { pid, cid } = req.params;
    const products = await productModel
      .find({
        category: cid,
        _id: { $ne: pid },
      })
      .select("-photo")
      .limit(3)
      .populate("category");
    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error while geting related product",
      error,
    });
  }
};

//get product by category
export const productCategoryController = async (req, res) => {
  try {
    // const { slug } = req.params;
    const { limit = 100, page = 1 } = req.query;
    const skip = (page - 1) * limit;
    const category = await categoryModel.findOne({ slug: req.params.slug });
    const products = await productModel
      .find({ category })
      .populate("category")
      .limit(parseInt(limit))
      .skip(skip);

    const totalProducts = await productModel.countDocuments({ category });

    res.status(200).send({
      success: true,
      category,
      products,
      totalProducts,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalProducts / limit),
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      error,
      message: "Error while getting products",
    });
  }
};

// Get products by tag
export const getProductsByTagController = async (req, res) => {
  try {
    const { tag } = req.params;

    // Find products with the same tag
    const relatedProducts = await productModel
      .find({ tag })
      .select("-photo")
      .limit(5); // Limit the number of related products as needed

    res.status(200).send({
      success: true,
      message: "Related products fetched by tag",
      relatedProducts,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while getting related products by tag",
      error,
    });
  }
};
