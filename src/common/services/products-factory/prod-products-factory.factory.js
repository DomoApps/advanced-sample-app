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
      return getProducts().then(productsArray => {
        return productsArray.reduce((productCategories, product) => {
          if (productCategories.indexOf(product.category) === -1) {
            productCategories.push(product.category);
          }
          return productCategories;
        }, []);
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
      return getProducts(category).then(productsArray => {
        return productsArray.length;
      });
    }

    /**
     * returns a number representing the total number of physical products
     * @return {promise(number)} number of physical products
     */
    function getTotalQuantity(category) {
      return getProducts(category).then(productsArray => {
        return productsArray.reduce((totalProductQuantity, product) => {
          return totalProductQuantity + product.quantity;
        }, 0);
      });
    }
  }

  prodProductsFactory.$inject = ['SAMPLE_APP'];

  ngModule.factory('prodProductsFactory', prodProductsFactory);
};
