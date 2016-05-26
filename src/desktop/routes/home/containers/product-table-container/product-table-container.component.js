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
    // private
    let _hideOutOfStock = false;
    let _fullProducts = [];

    // public
    ctrl.$onInit = $onInit;
    ctrl.onCheckboxUpdate = onCheckboxUpdate;

    ctrl.filteredProducts = [];
    ctrl.loading = true;

    function $onInit() {
      // Called on each controller after all the controllers have been constructed and had their bindings initialized
      // Use this for initialization code.
      refreshProducts();
    }

    function onCheckboxUpdate(newValue) {
      _hideOutOfStock = newValue;
      // if our products are loaded, apply the filter
      if (!ctrl.loading) {
        ctrl.filteredProducts = filterProducts(_fullProducts, _hideOutOfStock);
      }
    }

    // refreshes the stored product list from the provider
    // warning, mutates this objects state!
    function refreshProducts() {
      productsProvider.getProducts().then(data => {
        _fullProducts = data;
        ctrl.filteredProducts = filterProducts(_fullProducts, _hideOutOfStock);
        ctrl.loading = false;
      }, error => {
        console.log(error);
      });
    }

    // filter the products based on whether or not they are out of stock
    function filterProducts(products, hideOutOfStock) {
      // bypass filter if we are not supposed to filter
      if (!hideOutOfStock) {
        return products;
      }
      // else, return a filtered array
      return products.filter(product => {
        return product.inStock;
      });
    }
  }

  // inject dependencies here
  productTableContainerCtrl.$inject = ['productsProvider'];

  if (ON_TEST) {
    require('./product-table-container.component.spec.js')(ngModule);
  }
};
