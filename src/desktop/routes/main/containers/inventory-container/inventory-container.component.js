module.exports = ngModule => {
  require('./inventory-container.component.css');

  ngModule.component('inventoryContainer', {
    template: require('./inventory-container.component.html'),
    controller: inventoryContainerCtrl,
    bindings: {
      // Inputs should use < and @ bindings.
      // Outputs should use & bindings.
    }
  });

  function inventoryContainerCtrl(productsService, _) {
    const ctrl = this;
    // private
    let _hideOutOfStock = false;
    let _inStockProducts = [];
    let _searchText = '';

    // public
    ctrl.$onInit = $onInit;
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
      refreshProducts();
    }

    function onCheckboxUpdate(newValue) {
      _hideOutOfStock = newValue;
      if (!ctrl.loading) {
        ctrl.tableFilteredProducts = filterProducts(ctrl.outOfStockProducts.concat(_inStockProducts), _hideOutOfStock, _searchText);
      }
    }

    function onSearchTextUpdate(newValue) {
      _searchText = newValue;
      if (!ctrl.loading) {
        ctrl.tableFilteredProducts = filterProducts(ctrl.outOfStockProducts.concat(_inStockProducts), _hideOutOfStock, _searchText);
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
      ctrl.tableFilteredProducts = filterProducts(ctrl.outOfStockProducts.concat(_inStockProducts), _hideOutOfStock, _searchText);
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
        ctrl.tableFilteredProducts = filterProducts(ctrl.outOfStockProducts.concat(_inStockProducts), _hideOutOfStock, _searchText);
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
  inventoryContainerCtrl.$inject = ['productsService', '_'];

  if (ON_TEST) {
    require('./inventory-container.component.spec.js')(ngModule);
  }
};
