// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// !!!!!!   Note about datasources !!!!!!!
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//
// Normally in a production app one would
// gather data from a 'datasource'. This
// data is gathered through the Domo client
// included by adding `domo = require('ryuu.js');`
// to the top of your file.
//
// For our purposes we have left sample code
// using the Domo client to query data.
// This code is dispersed in comments or at
// the bottom of relevant methods.
//
// More information on the Domo client can
// be found at https://developer.domo.com


// const Query = require('@domoinc/query');
// const domo = require('ryuu.js');

const sampleProducts = require('./sample-products.json');

/**
 * productsService: interface for domo backend
 * @method getProducts
 * @method getProductCategories
 */
module.exports = ngModule => {
  function productsFactory(SAMPLE_APP, $q, $timeout) {
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

    //// Functions ////

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
      _productsPromises[category] = $timeout(() => {
        return (category === SAMPLE_APP.DEFAULT_CATEGORY) ? sampleProducts : sampleProducts.filter(product => {
          return product.category === category;
        });
      }, 1000);
      return _productsPromises[category];
      // query for using domo.get in production:
      //_productsPromises[category] = domo.get((new Query()).select(['category', 'name', 'price', 'inStock']).query('products')).then(products => {
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

  // inject dependencies here
  productsFactory.$inject = ['SAMPLE_APP', '$q', '$timeout'];

  ngModule.factory('productsFactory', productsFactory);

  if (ON_TEST) {
    require('./products-factory.factory.spec.js')(ngModule);
  }
};
