module.exports = ngModule => {
  require('./inventory-tools.component.css');

  ngModule.component('inventoryTools', {
    template: require('./inventory-tools.component.html'),
    controller: inventoryToolsCtrl,
    bindings: {
      // Inputs should use < and @ bindings.
      searchBarItems: '<',
      inventoryValue: '<',
      uniqueProducts: '<',
      totalQuantity: '<',
      filterFunction: '<',
      // Outputs should use & bindings.
      onSearchTextUpdate: '&'
    }
  });

  function inventoryToolsCtrl() {
    const ctrl = this;

    ctrl.$onInit = $onInit;
    ctrl.searchTextUpdate = searchTextUpdate;

    function $onInit() {
      // Called on each controller after all the controllers have been constructed and had their bindings initialized
      // Use this for initialization code.
    }

    function searchTextUpdate(searchText) {
      ctrl.onSearchTextUpdate({ searchText });
    }
  }

  // inject dependencies here
  inventoryToolsCtrl.$inject = [];

  if (ON_TEST) {
    require('./inventory-tools.component.spec.js')(ngModule);
  }
};
