const Product = require("../models/product");

const getProducts = async (req, res) => {
  const { featured, company, name, sort, fields, numericFilters } = req.query;
  const queryObject = {};
  //! filter
  if (featured) {
    queryObject.featured = featured === "true" ? true : false;
  }
  if (company) {
    queryObject.company = company;
  }
  if (name) {
    queryObject.name = { $regex: name, $options: "i" };
  }

  //! numeric filter
  if (numericFilters) {
    const operatorMap = {
      ">": "$gt",
      ">=": "$gte",
      "<": "$lt",
      "<=": "$lte",
      "=": "$eq",
    };
    const regEx = /\b(>|>=|<|<=|=)\b/g;
    let filters = numericFilters.replace(
      regEx,
      (match) => `-${operatorMap[match]}-`
    );
    const options = ["price", "rating"];
    filters.split(",").forEach((item) => {
      const [field, operator, value] = item.split("-");
      if (options.includes(field)) {
        queryObject[field] = { [operator]: Number(value) };
      }
    });
  }
  //> If we don't await it will return a query object using which we can construct out query by chaining differnet methods, as soon as we put await it returns documents and then we can not use any methods on it
  let query = Product.find(queryObject);

  //! sort
  if (sort) {
    const sortList = sort.split(",").join(" ");
    query = query.sort(sortList);
  } else {
    query = query.sort("createdAt");
  }

  //! select
  if (fields) {
    const fieldsList = fields.split(",").join(" "); // name price
    query = query.select(fieldsList);
  }

  //! pagination
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  query = query.limit(limit).skip(skip);

  //! finally getting documents
  const products = await query;
  res.status(200).json({ products, nbHits: products.length });
};

module.exports = {
  getProducts,
};
