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
/**
 * productsService: interface for domo backend
 * @method getProducts
 * @method getProductCategories
 */
module.exports = ngModule => {
  function productsFactory(SAMPLE_APP, $injector) {
    if (SAMPLE_APP.MOCK_REQUESTS) {
      return $injector.get('devProductsFactory');
    }
    return $injector.get('prodProductsFactory');
  }

  // inject dependencies here
  productsFactory.$inject = ['SAMPLE_APP', '$injector'];

  ngModule.factory('productsFactory', productsFactory);

  if (ON_TEST) {
    require('./products-factory.factory.spec.js')(ngModule);
  }
};
