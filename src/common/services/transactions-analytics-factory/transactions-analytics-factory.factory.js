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


//const Query = require('@domoinc/query');
//const domo = require('ryuu.js');


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
