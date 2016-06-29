module.exports = ngModule => {
  require('./tabs-container.component.css');

  ngModule.component('tabsContainer', {
    template: require('./tabs-container.component.html'),
    controller: tabsContainerCtrl,
    bindings: {
      // Inputs should use < and @ bindings.
      // Outputs should use & bindings.
    },
    transclude: true
  });

  function tabsContainerCtrl($state, $scope, productsFactory, $mdSidenav) {
    const ctrl = this;

    ctrl.$onInit = $onInit;
    ctrl.goToPage = goToPage;
    ctrl.toggleSidenav = toggleSidenav;
    ctrl.onCategorySelect = onCategorySelect;
    ctrl.selectedTab = 'products';
    ctrl.categoryFilters = [];
    ctrl.categoryFilter = '';

    productsFactory.getNumUniqueProducts().then(numUniqueProducts => {
      ctrl.uniqueProducts = numUniqueProducts;
    });
    productsFactory.getTotalQuantity().then(totalQuantity => {
      ctrl.totalQuantity = totalQuantity;
    });
    productsFactory.getInventoryValue().then(inventoryValue => {
      ctrl.inventoryValue = inventoryValue;
    });

    function $onInit() {
      // Called on each controller after all the controllers have been constructed and had their bindings initialized
      // Use this for initialization code.
      // set a watch on the current state name so we can set the tabs properly
      $scope.state = $state;
      $scope.$watch('state.current.name', newValue => {
        ctrl.selectedTab = newValue;
      });
      ctrl.selectedTab = $state.current.name;
      productsFactory.getProductCategories().then(categories => {
        categories.unshift('All');
        ctrl.categoryFilters = categories;
        ctrl.categoryFilter = ctrl.categoryFilters[0];
      });
    }

    function toggleSidenav() {
      $mdSidenav('filters').toggle();
    }

    function goToPage(page) {
      $state.go(page);
    }

    function onCategorySelect() {
      toggleSidenav();
    }
  }

  // inject dependencies here
  tabsContainerCtrl.$inject = ['$state', '$scope', 'productsFactory', '$mdSidenav'];

  if (ON_TEST) {
    require('./tabs-container.component.spec.js')(ngModule);
  }
};
