const sampleProducts = require('./sample-products.json');
console.log(sampleProducts);

/**
 * productsService: interface for domo backend
 * @method getProducts
 * @method getProductCategories
 */
module.exports = ngModule => {
  function productsFactory($q, $timeout) {
    // Private variables
    let _products = undefined;
    let _productsPromise = undefined;
    // Public API here
    const service = {
      getProducts,
      getProductCategories
    };

    return service;

    //// Functions ////

    /**
     * returns a list of products from the server.
     * Will cache queries and thus only makes one request per instantiation
     * of the service.
     *
     * @return {promise}  Promise returning an array of format [{category, name, price, inStock}, {...}, ...]
     */
    function getProducts() {
      // 3 possiblities: never before requested, in progress, and already received
      // are they already being requested?

      if (typeof _productsPromise !== 'undefined') {
        return _productsPromise;
      }

      if (typeof _products !== 'undefined') {
        return $q.resolve(_products);
      }

      // store productsPromise in case a parallel request comes in, that way the data is requested only once
      _productsPromise = $timeout(() => {
        console.log('timed out!', sampleProducts);
        // transform inStock because it arrives as a string instead of a bool
        for (let i = 0; i < sampleProducts.length; i++) {
          sampleProducts[i].inStock = (sampleProducts[i].inStock === 'true' ? true : false);
        }
        _products = sampleProducts;
        return sampleProducts;
      }, 1000);
      return _productsPromise;
    }

    /**
     * returns a list of product categories
     * @return {promise}  Promise returning array of format [string, string, string...]
     */
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
  }

  // inject dependencies here
  productsFactory.$inject = ['$q', '$timeout'];

  ngModule.factory('productsFactory', productsFactory);

  if (ON_TEST) {
    require('./products-factory.factory.spec.js')(ngModule);
  }
};
