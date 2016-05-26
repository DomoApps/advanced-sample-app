module.exports = ngModule => {
  function productsProvider() {
    // Private variables
    const meaningOfLife = 42;

    // Public API here
    const service = {
      getMeaningOfLife,
    };

    return service;

    //// Functions ////
    function getMeaningOfLife() {
      return meaningOfLife;
    }
  }

  // inject dependencies here
  productsProvider.$inject = [];

  ngModule.factory('productsProvider', productsProvider);

  if (ON_TEST) {
    require('./products-provider.factory.spec.js')(ngModule);
  }
};
