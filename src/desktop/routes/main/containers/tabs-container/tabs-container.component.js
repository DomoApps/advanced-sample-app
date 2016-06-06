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

  function tabsContainerCtrl($state, daFilters, productsService) {
    const ctrl = this;

    ctrl.$onInit = $onInit;
    ctrl.goToPage = goToPage;
    ctrl.selectedTab = 'products';

    $state.go('products');

    function $onInit() {
      // Called on each controller after all the controllers have been constructed and had their bindings initialized
      // Use this for initialization code.
      // TODO: setup tabs based on routing
      productsService.getProductCategories().then(categories => {
        categories.unshift('All');
        daFilters.initFilters(categories.map(category => {
          return {
            Id: 'category',
            FieldName: 'category',
            FilterName: 'Product Category',
            FieldValues: category,
            DataType: 'string',
            InputType: 'Single Select',
            ColumnName: 'category'
          };
        }), {});
      });
    }

    function goToPage(page) {
      ctrl.selectedTab = page;
      $state.go(page);
    }
  }

  // inject dependencies here
  tabsContainerCtrl.$inject = ['$state', 'daFilters', 'productsService'];

  if (ON_TEST) {
    require('./tabs-container.component.spec.js')(ngModule);
  }
};
