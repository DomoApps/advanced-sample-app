module.exports = ngModule => {
  require('./tabs-container.component.css');

  ngModule.component('tabsContainer', {
    template: require('./tabs-container.component.html'),
    controller: tabsContainerCtrl,
    bindings: {
      // Inputs should use < and @ bindings.
      // Outputs should use & bindings.
    }
  });

  function tabsContainerCtrl($state, $scope, daEvents, daFilters, productsService) {
    const ctrl = this;

    ctrl.$onInit = $onInit;
    ctrl.goToPage = goToPage;
    ctrl.selectedTab = 'products';
    ctrl.categoryFilters = undefined;

    function $onInit() {
      // Called on each controller after all the controllers have been constructed and had their bindings initialized
      // Use this for initialization code.
      // set a watch on the current state name so we can set the tabs properly
      $scope.state = $state;
      $scope.$watch('state.current.name', newValue => {
        ctrl.selectedTab = newValue;
      });
      ctrl.selectedTab = $state.current.name;
      // setup the filters from product categories
      productsService.getProductCategories().then(categories => {
        categories.unshift('All');
        const categoryFilters = categories.map(category => {
          // daFilters flat config object. This adds to the filter box in the upper left
          return {
            Id: 'category',
            FieldName: 'category',
            FilterName: 'Product Category',
            FieldValues: category,
            DataType: 'string',
            InputType: 'Single Select',
            ColumnName: 'category'
          };
        });
        daFilters.initFilters(categoryFilters, {});
      });
      // listen for a change in filters, then propagate
      daEvents.on('daFilters:update', () => {
        daFilters.getSelectedOptions().then(options => {
          ctrl.categoryFilters = options[0].selections[0];
        });
      });
    }

    function goToPage(page) {
      $state.go(page);
    }
  }

  // inject dependencies here
  tabsContainerCtrl.$inject = ['$state', '$scope', 'daEvents', 'daFilters', 'productsService'];

  if (ON_TEST) {
    require('./tabs-container.component.spec.js')(ngModule);
  }
};
