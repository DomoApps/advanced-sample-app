const Query = require('@domoinc/query');
const domo = require('ryuu.js');

module.exports = ngModule => {
  function productsService($q) {
    // Private variables
    let products = undefined;
    let productsPromise = undefined;
    // Public API here
    const service = {
      getProducts,
      getProductCategories
    };

    return service;

    //// Functions ////

    function getProducts() {
      // 3 possiblities: never before requested, in progress, and already received
      // are they already being requested?
      if (typeof productsPromise !== 'undefined') {
        return productsPromise;
      }
      if (typeof products !== 'undefined') {
        return $q.resolve(products);
      }
      // get copy of products
      productsPromise = domo.get(buildQuery()).then(data => {
        // transform some annoying stringy server stuff
        for (let i = 0; i < data.length; i++) {
          data[i].inStock = (data[i].inStock === 'true' ? true : false);
        }
        products = data;
        return data;
      });
      return productsPromise;
    }

    function getProductCategories() {
      return getProducts().then(productsArray => {
        const categories = [];
        for (let i = 0; i < productsArray.length; i++) {
          if (categories.indexOf(productsArray[i].category) === -1) {
            categories.push(productsArray[i].category);
          }
        }
        return categories;
      });
    }

    function buildQuery() {
      const queryBuilder = new Query();

      const query = queryBuilder.select(['category', 'name', 'price', 'inStock']);

      return query.query('products');
    }
  }

  // inject dependencies here
  productsService.$inject = ['$q'];

  ngModule.factory('productsService', productsService);

  if (ON_TEST) {
    require('./products-service.factory.spec.js')(ngModule);
  }
};
