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

  function inventoryContainerCtrl($q, productsFactory, globalFiltersFactory, SAMPLE_APP) {
    const ctrl = this;
    // private
    let _products = [];
    let _categories = [];

    ctrl.onSearchbarUpdate = onSearchbarUpdate;
    ctrl.filterByName = filterByName;
    ctrl.filteredProducts = [];
    ctrl.filteredCategories = [];
    ctrl.searchBarItems = [];
    ctrl.searchText = '';
    ctrl.loading = true;

    _getToolbarItems(globalFiltersFactory.getFilter());
    $q.all([_getProducts(globalFiltersFactory.getFilter()), _getCategories()]).then(() => {
      ctrl.filteredProducts = _products;
      _filterCategories(globalFiltersFactory.getFilter());
      _buildAutocompleteList();
      ctrl.loading = false;
    });

    globalFiltersFactory.onFilterChange(_handleGlobalCategoryChange);

    function onSearchbarUpdate(searchText) {
      ctrl.searchText = searchText.toLowerCase();
      _filterProducts();
    }

    function _handleGlobalCategoryChange(e, newCategory) {
      ctrl.loading = true;
      _getToolbarItems(newCategory);
      _filterCategories(newCategory);
      _getProducts(newCategory).then(() => {
        _filterProducts();
        _buildAutocompleteList();
        ctrl.loading = false;
      });
    }

    function _getProducts(category) {
      return productsFactory.getProducts(category).then(products => {
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

    function _getToolbarItems(category) {
      ctrl.uniqueProducts = undefined;
      productsFactory.getNumUniqueProducts(category).then(numUniqueProducts => {
        ctrl.uniqueProducts = numUniqueProducts;
      });
      ctrl.totalQuantity = undefined;
      productsFactory.getTotalQuantity(category).then(totalQuantity => {
        ctrl.totalQuantity = totalQuantity;
      });
      ctrl.inventoryValue = undefined;
      productsFactory.getInventoryValue(category).then(inventoryValue => {
        ctrl.inventoryValue = inventoryValue;
      });
    }

    function _filterCategories(newCategory) {
      if (newCategory !== SAMPLE_APP.DEFAULT_CATEGORY) {
        ctrl.filteredCategories = [newCategory];
      } else {
        ctrl.filteredCategories = _categories;
      }
    }

    function _filterProducts() {
      ctrl.filteredProducts = _products.filter(product => {
        // either category or name can match
        return ((product.name.toLowerCase().indexOf(ctrl.searchText) !== -1)
            || (product.category.toLowerCase().indexOf(ctrl.searchText) !== -1));
      });
    }

    function _buildAutocompleteList() {
      ctrl.searchBarItems = ctrl.filteredCategories.concat(ctrl.filteredProducts.map(product => {
        return product.name;
      }));
    }

    // this function is to be passed down to the search-bar
    // it's up here so both filtering functions are next to each other
    // it's separate from filterProductsAndCategories so we don't have
    // to run a bunch of array.maps
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
  inventoryContainerCtrl.$inject = ['$q', 'productsFactory', 'globalFiltersFactory', 'SAMPLE_APP'];

  if (ON_TEST) {
    require('./inventory-container.component.spec.js')(ngModule);
  }
};
