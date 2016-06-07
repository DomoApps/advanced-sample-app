module.exports = ngModule => {
  require('./inventory-container.component.css');

  ngModule.component('inventoryContainer', {
    template: require('./inventory-container.component.html'),
    controller: inventoryContainerCtrl,
    bindings: {
      // Inputs should use < and @ bindings.
      'allValue': '<' // constant dictating the string value for the "ALL" filter
      // Outputs should use & bindings.
    }
  });

  function inventoryContainerCtrl(productsService, _, daEvents, daFilters) {
    const ctrl = this;
    // private
    let _hideOutOfStock = false;
    let _inStockProducts = [];
    let _searchText = '';
    const _listeners = [];
    let _categoryFilter = undefined;

    // public
    ctrl.$onInit = $onInit;
    ctrl.$onDestroy = $onDestroy;
    ctrl.onCheckboxUpdate = onCheckboxUpdate;
    ctrl.onSearchTextUpdate = onSearchTextUpdate;
    ctrl.stockProduct = stockProduct;
    ctrl.outOfStockProducts = []; // exposing this for our product stocker

    ctrl.tableFilteredProducts = [];
    ctrl.loading = true; // we want the data to fade in nicely!

    // yeah, this is ridiculous, but da-table forced our hand. Again.
    ctrl.doNothing = () => { return; };

    // mutating methods
    function $onInit() {
      // Called on each controller after all the controllers have been constructed and had their bindings initialized
      // Use this for initialization code.
      // todo: pull this out into its parent, figure out how to make that work with ui-router
      _listeners.push(daEvents.on('daFilters:update', () => {
        daFilters.getSelectedOptions().then(options => {
          console.log(options);
          // check to make sure it's not the 'all' category
          // todo: set this as an application constant?
          if (options[0].selections[0] !== 'All') {
            _categoryFilter = options[0].selections[0];
            ctrl.tableFilteredProducts = filterProducts(ctrl.outOfStockProducts.concat(_inStockProducts), _hideOutOfStock, _searchText, _categoryFilter);
          }
        });
      }));
      refreshProducts();
    }

    function $onDestroy() {
      _listeners.forEach(deregister => {
        deregister();
      });
    }

    function onCheckboxUpdate(newValue) {
      _hideOutOfStock = newValue;
      if (!ctrl.loading) {
        ctrl.tableFilteredProducts = filterProducts(ctrl.outOfStockProducts.concat(_inStockProducts), _hideOutOfStock, _searchText, _categoryFilter);
      }
    }

    function onSearchTextUpdate(newValue) {
      _searchText = newValue;
      if (!ctrl.loading) {
        ctrl.tableFilteredProducts = filterProducts(ctrl.outOfStockProducts.concat(_inStockProducts), _hideOutOfStock, _searchText, _categoryFilter);
      }
    }

    function stockProduct(product) {
      // remove the product from out of stock and add it to in stock
      const i = ctrl.outOfStockProducts.indexOf(product);
      if (i === -1) {
        console.log('We asked to restock a product that is not out of stock!');
        return;
      }
      ctrl.outOfStockProducts.splice(i, 1);
      console.log(product);
      product.inStock = true;
      _inStockProducts.push(product);
      ctrl.tableFilteredProducts = filterProducts(ctrl.outOfStockProducts.concat(_inStockProducts), _hideOutOfStock, _searchText, _categoryFilter);
    }

    // refreshes the stored product list from the service
    // warning, mutates this object's state!
    function refreshProducts() {
      productsService.getProducts().then(data => {
        // get the in stock and out of stock products
        const partitioned = _.partition(data, product => {
          return product.inStock;
        });
        _inStockProducts = partitioned[0];
        ctrl.outOfStockProducts = partitioned[1];
        console.log(ctrl.outOfStockProducts);
        console.log(ctrl.outOfStockProducts);
        ctrl.tableFilteredProducts = filterProducts(ctrl.outOfStockProducts.concat(_inStockProducts), _hideOutOfStock, _searchText, _categoryFilter);
        ctrl.loading = false;
      }, error => {
        console.log(error);
      });
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
  inventoryContainerCtrl.$inject = ['productsService', '_', 'daEvents', 'daFilters'];

  if (ON_TEST) {
    require('./inventory-container.component.spec.js')(ngModule);
  }
};
