module.exports = ngModule => {
  require('./product-table.component.css');

  ngModule.component('productTable', {
    template: require('./product-table.component.html'),
    controller: productTableCtrl,
    bindings: {
      // Inputs should use < and @ bindings.
      headings: '<',
      products: '<'
      // Outputs should use & bindings.
    }
  });

  function productTableCtrl() {
    const ctrl = this;

    ctrl.orderBy = orderBy;

    ctrl.orderByProperty = 'inStock';
    ctrl.reverseOrder = false;

    /**
     * function called on click. Checks to see if we have already sorted by this
     * property, if we have it will reverse the sort order. If not, it will
     * initiate sorting by that property
     * @param  {string} property property to sort by (i.e. category, name, price...)
     */
    function orderBy(property) {
      ctrl.reverseOrder = (ctrl.orderByProperty === property) ? !ctrl.reverseOrder : false;
      ctrl.orderByProperty = property;
    }
  }

  // inject dependencies here
  productTableCtrl.$inject = [];

  if (ON_TEST) {
    require('./product-table.component.spec.js')(ngModule);
  }
};
