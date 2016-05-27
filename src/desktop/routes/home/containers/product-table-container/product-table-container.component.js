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
    let _searchText = '';

    // public
    ctrl.$onInit = $onInit;
    ctrl.onCheckboxUpdate = onCheckboxUpdate;
    ctrl.onSearchTextUpdate = onSearchTextUpdate;

    ctrl.filteredProducts = [];
    ctrl.loading = true;

    function $onInit() {
      // Called on each controller after all the controllers have been constructed and had their bindings initialized
      // Use this for initialization code.
      refreshProducts();
    }

    function onCheckboxUpdate(newValue) {
      handleInputChange('hideOutOfStock', newValue);
    }

    function onSearchTextUpdate(newValue) {
      handleInputChange('searchText', newValue);
    }

    function handleInputChange(changeType, newValue) {
      if (changeType === 'searchText') {
        _searchText = newValue;
      }
      if (changeType === 'hideOutOfStock') {
        _hideOutOfStock = newValue;
      }
      if (!ctrl.loading) {
        ctrl.filteredProducts = filterProducts(_fullProducts, _hideOutOfStock, _searchText);
      }
    }

    // refreshes the stored product list from the provider
    // warning, mutates this objects state!
    function refreshProducts() {
      productsProvider.getProducts().then(data => {
        _fullProducts = data;
        ctrl.filteredProducts = filterProducts(_fullProducts, _hideOutOfStock, _searchText);
        ctrl.loading = false;
      }, error => {
        console.log(error);
      });
    }

    function filterProducts(products, hideOutOfStock, searchText) {
      // bypass first filter if we are not supposed to filter stock
      let toReturn = products;
      if (hideOutOfStock) {
        toReturn = toReturn.filter(product => {
          return product.inStock;
        });
      }
      if (searchText !== '') {
        const lowerCaseSearchText = searchText.toLowerCase();
        toReturn = toReturn.filter(product => {
          return (product.name.toLowerCase().indexOf(lowerCaseSearchText) !== -1);
        });
      }
      return toReturn;
    }
  }

  // inject dependencies here
  productTableContainerCtrl.$inject = ['productsProvider'];

  if (ON_TEST) {
    require('./product-table-container.component.spec.js')(ngModule);
  }
};
