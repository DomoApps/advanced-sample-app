module.exports = ngModule => {
  function prodProductsFactory(SAMPLE_APP) {
    const domo = require('ryuu.js');
    const Query = require('@domoinc/query');
    // Private variables
    const _productsPromises = {};
    // Public API here
    const service = {
      getProducts,
      getProductCategories,
      getInventoryValue,
      getNumUniqueProducts,
      getTotalQuantity
    };

    return service;


    /**
     * returns a list of products form the server.
     * @param  {string} category optional: string of the category to filter by
     * @return {promise} Promise returning an array of format [{category, name, price, quantity}, {...}, ...]
     */
    function getProducts(optCategory) {
      const category = typeof optCategory === 'undefined' ? SAMPLE_APP.DEFAULT_CATEGORY : optCategory;

      // check to make sure this request hasn't already been filled
      if (typeof _productsPromises[category] !== 'undefined') {
        return _productsPromises[category];
      }

      // store productsPromise in case a parallel request comes in, that way the data is requested only once
      const productsQuery = (new Query()).select(['category', 'name', 'price', 'quantity']);
      if (category !== SAMPLE_APP.DEFAULT_CATEGORY) {
        productsQuery.where('category').equals(category);
      }
      _productsPromises[category] = domo.get(productsQuery.query('products'));
      return _productsPromises[category];
    }

    /**
     * returns a list of product categories
     * @return {promise}  Promise returning array of format [string, string, string...]
     */
    function getProductCategories() {
      return domo.get((new Query())
        .select(['category'])
        .groupBy('category')
        .query('products'))
        .then(categories => {
          return categories.map(category => {
            return category.category;
          });
        });
    }

    /**
     * returns a number representing the total value of the products
     * @return {promise(number)} total value of products
     */
    function getInventoryValue(category) {
      return getProducts(category).then(productsArray => {
        return productsArray.reduce((totalValue, product) => {
          return totalValue + (product.price * product.quantity);
        }, 0);
      });
    }

    /**
     * returns a number representing the amount of unique product types
     * @return {promise(number)} number of unique product types
     */
    function getNumUniqueProducts(category) {
      const query = (new Query()).select(['name']);
      if (typeof category !== 'undefined' && category !== SAMPLE_APP.DEFAULT_CATEGORY) {
        query.where('category').equals(category);
      }
      return domo.get(query
        .select(['name'])
        .aggregate('name', 'count')
        .query('products'))
        .then(result => {
          return result[0].name;
        });
    }

    /**
     * returns a number representing the total number of physical products
     * @return {promise(number)} number of physical products
     */
    function getTotalQuantity(category) {
      const query = (new Query()).select(['quantity']);
      if (typeof category !== 'undefined' && category !== SAMPLE_APP.DEFAULT_CATEGORY) {
        query.where('category').equals(category);
      }
      return domo.get(query
        .select(['name'])
        .aggregate('quantity', 'sum')
        .query('products'))
        .then(result => {
          return result[0].quantity;
        });
    }
  }

  prodProductsFactory.$inject = ['SAMPLE_APP'];

  ngModule.factory('prodProductsFactory', prodProductsFactory);
};
