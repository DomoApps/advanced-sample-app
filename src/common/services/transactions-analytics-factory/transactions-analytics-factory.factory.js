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
// The code you use can be chosen by changing
// the value of MOCK_REQUESTS in desktop/index.js
//
// More information on the Domo client can
// be found at https://developer.domo.com
/**
 * transactionAnalyticsFactory
 * @method getTotals
 * @method getTransactionsPerX
 */
module.exports = ngModule => {
  function transactionsAnalyticsFactory($injector, SAMPLE_APP) {
    if (SAMPLE_APP.MOCK_REQUESTS) {
      return $injector.get('devTransactionsAnalyticsFactory');
    }
    return $injector.get('prodTransactionsAnalyticsFactory');
  }

  transactionsAnalyticsFactory.$inject = ['$injector', 'SAMPLE_APP'];

  ngModule.factory('transactionsAnalyticsFactory', transactionsAnalyticsFactory);

  if (ON_TEST) {
    require('./transactions-analytics-factory.factory.spec.js')(ngModule);
  }
};
