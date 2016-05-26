const Query = require('@domoinc/query');
const domo = require('ryuu.js');

module.exports = ngModule => {
  function productsProvider($q) {
    // Private variables
    let products = undefined;
    // Public API here
    const service = {
      getProducts: getCachedProducts
    };

    return service;

    //// Functions ////

    function getCachedProducts() {
      if (typeof products !== 'undefined') {
        return $q(resolve => {
          resolve(products);
        });
      }
      return getProducts();
    }

    function getProducts() {
      const deferred = $q.defer();
      // get copy of products
      domo.get(buildQuery()).then(data => {
        products = data;
        deferred.resolve(data);
      }, error => {
        deferred.reject(error);
      });
      return deferred.promise;
    }

    function buildQuery() {
      const queryBuilder = new Query();

      const query = queryBuilder.select(['category', 'name', 'price', 'inStock']);

      return query.query('products');
    }
  }

  // inject dependencies here
  productsProvider.$inject = ['$q'];

  ngModule.factory('productsProvider', productsProvider);

  if (ON_TEST) {
    require('./products-provider.factory.spec.js')(ngModule);
  }
};
