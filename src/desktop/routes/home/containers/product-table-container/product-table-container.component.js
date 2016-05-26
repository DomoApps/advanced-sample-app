module.exports = ngModule => {
  require('./product-table-container.component.css');

  ngModule.component('productTableContainer', {
    template: require('./product-table-container.component.html'),
    controller: productTableContainerCtrl,
    bindings: {
      // Inputs should use < and @ bindings.
      // Outputs should use & bindings.
    }
  });

  function productTableContainerCtrl(productsProvider) {
    const ctrl = this;

    ctrl.$onInit = $onInit;

    ctrl.products = [];
    ctrl.loading = true;

    function $onInit() {
      // Called on each controller after all the controllers have been constructed and had their bindings initialized
      // Use this for initialization code.
      productsProvider.getProducts().then(data => {
        ctrl.products = data;
        ctrl.loading = false;
      }, error => {
        console.log(error);
      });
    }
  }

  // inject dependencies here
  productTableContainerCtrl.$inject = ['productsProvider'];

  if (ON_TEST) {
    require('./product-table-container.component.spec.js')(ngModule);
  }
};
