const Query = require('@domoinc/query');
const domo = require('ryuu.js');

module.exports = ngModule => {
  function productsService($q) {
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
        // transform some annoying stringy server stuff
        for (let i = 0; i < data.length; i++) {
          data[i].inStock = (data[i].inStock === 'true' ? true : false);
        }
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
  productsService.$inject = ['$q'];

  ngModule.factory('productsService', productsService);

  if (ON_TEST) {
    require('./products-service.factory.spec.js')(ngModule);
  }
};
