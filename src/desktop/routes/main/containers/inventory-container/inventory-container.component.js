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

  function inventoryContainerCtrl(productsService) {
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
    ctrl.loading = true; // we want the data to fade in nicely!

    ctrl.productTableHeight = '400px'; // normally we don't put presentation in the app logic, but da-table forced our hand!
    ctrl.productTableWidth = '1115px';
    ctrl.outOfStockTableHeight = '400px';
    ctrl.outOfStockTableWidth = '1115px';

    ctrl.productColumns = [{ name: 'Product Name' }, { name: 'Price' }, { name: '# In Stock' }];
    ctrl.productRows = [];
    ctrl.outOfStockColumns = [{ name: 'Products Out of Stock' }];
    ctrl.outOfStockRows = [];

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
        ctrl.filteredProducts = filterProducts(_fullProducts, _hideOutOfStock, _searchText);
        ctrl.productRows = generateRows(ctrl.filteredProducts);
      }
    }

    function onSearchTextUpdate(newValue) {
      _searchText = newValue;
      if (!ctrl.loading) {
        ctrl.filteredProducts = filterProducts(_fullProducts, _hideOutOfStock, _searchText);
        ctrl.productRows = generateRows(ctrl.filteredProducts);
      }
    }

    // refreshes the stored product list from the service
    // warning, mutates this object's state!
    function refreshProducts() {
      productsService.getProducts().then(data => {
        _fullProducts = data;
        ctrl.filteredProducts = filterProducts(_fullProducts, _hideOutOfStock, _searchText);
        ctrl.productRows = generateRows(ctrl.filteredProducts);
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

    function generateRows(products) {
      const toReturn = [];
      for (let i = 0; i < products.length; i++) {
        toReturn.push({ cells: {
          'Product Name': { value: products[i].name, displayValue: products[i].name },
          'Price': { value: products[i].price, displayValue: products[i].price },
          '# In Stock': { value: products[i].inStock, displayValue: products[i].inStock }
        } });
      }
      return toReturn;
    }
  }

  // inject dependencies here
  inventoryContainerCtrl.$inject = ['productsService'];

  if (ON_TEST) {
    require('./inventory-container.component.spec.js')(ngModule);
  }
};
