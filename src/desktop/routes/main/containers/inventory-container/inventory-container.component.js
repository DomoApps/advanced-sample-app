module.exports = ngModule => {
  require('./inventory-container.component.css');

  ngModule.component('inventoryContainer', {
    template: require('./inventory-container.component.html'),
    controller: inventoryContainerCtrl,
    bindings: {
      // Inputs should use < and @ bindings.
      categoryFilter: '<' // a string of the category to filter by
      // Outputs should use & bindings.
    }
  });

  function inventoryContainerCtrl(productsService, _) {
    const ctrl = this;
    // private
    let _hideOutOfStock = false;
    let _inStockProducts = [];
    let _searchText = '';
    const _listeners = [];
    let _categoryFilter = undefined;

    // public
    ctrl.$onInit = $onInit;
    ctrl.$onChanges = $onChanges;
    ctrl.$onDestroy = $onDestroy;
    ctrl.onCheckboxUpdate = onCheckboxUpdate;
    ctrl.onSearchTextUpdate = onSearchTextUpdate;
    ctrl.stockProduct = stockProduct;
    ctrl.outOfStockProducts = []; // exposing this for our product stocker

    ctrl.filteredProductsForTable = [];
    ctrl.loading = true; // we want the data to fade in nicely!

    // yeah, this is ridiculous, but da-table forced our hand. Again.
    ctrl.doNothing = () => { return; };

    // mutating methods
    function $onInit() {
      productsService.getProducts().then(data => {
        // get the in stock and out of stock products
        const partitioned = _.partition(data, product => {
          return product.inStock;
        });
        _inStockProducts = partitioned[0];
        ctrl.outOfStockProducts = partitioned[1];
        console.log(ctrl.outOfStockProducts);
        console.log(ctrl.outOfStockProducts);
        ctrl.filteredProductsForTable = filterProducts(ctrl.outOfStockProducts.concat(_inStockProducts), _hideOutOfStock, _searchText, _categoryFilter);
        ctrl.loading = false;
      }, error => {
        console.log(error);
      });
    }

    function $onChanges(changes) {
      if (typeof changes.categoryFilter !== 'undefined') {
        if (changes.categoryFilter.currentValue !== 'All') {
          _categoryFilter = changes.categoryFilter.currentValue;
          ctrl.filteredProductsForTable = filterProducts(ctrl.outOfStockProducts.concat(_inStockProducts), _hideOutOfStock, _searchText, _categoryFilter);
        }
      }
    }

    function $onDestroy() {
      _listeners.forEach(deregister => {
        deregister();
      });
    }

    function onCheckboxUpdate(newValue) {
      _hideOutOfStock = newValue;
      if (!ctrl.loading) {
        ctrl.filteredProductsForTable = filterProducts(ctrl.outOfStockProducts.concat(_inStockProducts), _hideOutOfStock, _searchText, _categoryFilter);
      }
    }

    function onSearchTextUpdate(newValue) {
      _searchText = newValue;
      if (!ctrl.loading) {
        ctrl.filteredProductsForTable = filterProducts(ctrl.outOfStockProducts.concat(_inStockProducts), _hideOutOfStock, _searchText, _categoryFilter);
      }
    }

    function stockProduct(product) {
      // remove the product from out of stock and add it to in stock
      const i = ctrl.outOfStockProducts.indexOf(product);
      if (i === -1) {
        // todo: error handling
        return;
      }
      ctrl.outOfStockProducts.splice(i, 1);
      product.inStock = true;
      _inStockProducts.push(product);
      ctrl.filteredProductsForTable = filterProducts(ctrl.outOfStockProducts.concat(_inStockProducts), _hideOutOfStock, _searchText, _categoryFilter);
    }

    // helper (functional) functions
    // because the dataset is so small we can do filtering on the client side
    // transactions and other larger datasets are done on the server
    function filterProducts(products, hideOutOfStock, searchText, categoryFilter) {
      const lowerCaseSearchText = searchText.toLowerCase();
      return products.filter(product => {
        return (hideOutOfStock ? product.inStock : true);
      }).filter(product => {
        return (typeof categoryFilter !== 'undefined' ? product.category === categoryFilter : true);
      }).filter(product => {
        return (searchText !== '' ? product.name.toLowerCase().indexOf(lowerCaseSearchText) !== -1 : true);
      });
    }
  }

  // inject dependencies here
  inventoryContainerCtrl.$inject = ['productsService', '_'];

  if (ON_TEST) {
    require('./inventory-container.component.spec.js')(ngModule);
  }
};
