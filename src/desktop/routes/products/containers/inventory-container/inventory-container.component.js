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

  function inventoryContainerCtrl($q, productsFactory) {
    const ctrl = this;
    // private
    let _products = [];
    let _categories = [];

    ctrl.filterProductsAndCategories = filterProductsAndCategories;
    ctrl.filterByName = filterByName;
    ctrl.filteredProducts = [];
    ctrl.filteredCategories = [];
    ctrl.searchBarItems = [];
    ctrl.loading = true;

    _getToolbarItems();

    $q.all([_getProducts(), _getCategories()]).then(() => {
      filterProductsAndCategories('');
      ctrl.loading = false;
    });

    function _getProducts() {
      return productsFactory.getProducts().then(products => {
        // get the in stock and out of stock products
        _products = products.map(product => {
          product.inStock = (product.quantity !== 0);
          return product;
        });
      });
    }

    function _getCategories() {
      return productsFactory.getProductCategories().then(categories => {
        _categories = categories;
      });
    }

    function _getToolbarItems() {
      productsFactory.getNumUniqueProducts().then(numUniqueProducts => {
        ctrl.uniqueProducts = numUniqueProducts;
      });
      productsFactory.getTotalQuantity().then(totalQuantity => {
        ctrl.totalQuantity = totalQuantity;
      });
      productsFactory.getInventoryValue().then(inventoryValue => {
        ctrl.inventoryValue = inventoryValue;
      });
      ctrl.productCategoriesPromise = productsFactory.getProductCategories().then(categories => {
        ctrl.filteredCategories = categories;
      });
    }

    function filterProductsAndCategories(searchText) {
      const lowerCaseSearchText = searchText.toLowerCase();
      if (lowerCaseSearchText !== '') {
        ctrl.filteredProducts = _products.filter(product => {
          return product.name.toLowerCase().indexOf(lowerCaseSearchText) !== -1;
        });
        ctrl.filteredCategories = _categories.filter(category => {
          return category.toLowerCase().indexOf(lowerCaseSearchText) !== -1;
        });
      } else {
        ctrl.filteredProducts = _products;
        ctrl.filteredCategories = _categories;
      }
      ctrl.searchBarItems = ctrl.filteredProducts.map(item => {
        return item.name;
      }).concat(ctrl.filteredCategories);
    }

    function filterByName(searchText, items) {
      const lowerCaseSearchText = searchText.toLowerCase();
      if (lowerCaseSearchText !== '') {
        return items.filter(item => {
          return item.toLowerCase().indexOf(lowerCaseSearchText) !== -1;
        });
      }
      return items;
    }
  }

  // inject dependencies here
  inventoryContainerCtrl.$inject = ['$q', 'productsFactory'];

  if (ON_TEST) {
    require('./inventory-container.component.spec.js')(ngModule);
  }
};
