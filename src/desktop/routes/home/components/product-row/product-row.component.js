module.exports = ngModule => {
  require('./product-row.component.css');

  ngModule.component('productRow', {
    template: require('./product-row.component.html'),
    controller: productRowCtrl,
    bindings: {
      // Inputs should use < and @ bindings.
      name: '<',
      price: '<'
      // Outputs should use & bindings.
    }
  });

  function productRowCtrl() {
    const ctrl = this;

    ctrl.$onInit = $onInit;

    function $onInit() {
      // Called on each controller after all the controllers have been constructed and had their bindings initialized
      // Use this for initialization code.
    }
  }

  // inject dependencies here
  productRowCtrl.$inject = [];

  if (ON_TEST) {
    require('./product-row.component.spec.js')(ngModule);
  }
};
