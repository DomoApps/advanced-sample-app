module.exports = ngModule => {
  require('./product-stocker.component.css');

  ngModule.component('productStocker', {
    template: require('./product-stocker.component.html'),
    controller: productStockerCtrl,
    bindings: {
      // Inputs should use < and @ bindings.
      productsOutOfStock: '<',
      // Outputs should use & bindings.
      stockProduct: '&'
    }
  });

  function productStockerCtrl() {
    const ctrl = this;

    ctrl.$onInit = $onInit;
    ctrl.onStockProduct = onStockProduct;

    function $onInit() {
      // Called on each controller after all the controllers have been constructed and had their bindings initialized
      // Use this for initialization code.
    }

    function onStockProduct(product) {
      ctrl.stockProduct({ product });
    }
  }

  // inject dependencies here
  productStockerCtrl.$inject = [];

  if (ON_TEST) {
    require('./product-stocker.component.spec.js')(ngModule);
  }
};
