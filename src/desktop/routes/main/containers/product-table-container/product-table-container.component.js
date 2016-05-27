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

  function productTableContainerCtrl(productsService, $state) {
    const ctrl = this;
    // private
    let _hideOutOfStock = false;
    let _fullProducts = [];
    let _searchText = '';

    // public
    ctrl.$onInit = $onInit;
    ctrl.onCheckboxUpdate = onCheckboxUpdate;
    ctrl.onSearchTextUpdate = onSearchTextUpdate;
    ctrl.goToPage = goToPage;

    ctrl.filteredProducts = [];
    ctrl.loading = true;

    // mutating methods
    function $onInit() {
      // Called on each controller after all the controllers have been constructed and had their bindings initialized
      // Use this for initialization code.
      refreshProducts();
    }

    function onCheckboxUpdate(newValue) {
      _hideOutOfStock = newValue;
      if (!ctrl.loading) {
        ctrl.filteredProducts = filterProducts(_fullProducts, _hideOutOfStock, _searchText);
      }
    }

    function onSearchTextUpdate(newValue) {
      _searchText = newValue;
      if (!ctrl.loading) {
        ctrl.filteredProducts = filterProducts(_fullProducts, _hideOutOfStock, _searchText);
      }
    }

    function goToPage(page) {
      $state.go(page);
    }

    // refreshes the stored product list from the service
    // warning, mutates this objects state!
    function refreshProducts() {
      productsService.getProducts().then(data => {
        _fullProducts = data;
        ctrl.filteredProducts = filterProducts(_fullProducts, _hideOutOfStock, _searchText);
        ctrl.loading = false;
      }, error => {
        console.log(error);
      });
    }

    // helper (functional) functions
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
  productTableContainerCtrl.$inject = ['productsService', '$state'];

  if (ON_TEST) {
    require('./product-table-container.component.spec.js')(ngModule);
  }
};
