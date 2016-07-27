module.exports = ngModule => {
  describe('component:inventoryContainer', () => {
    let scope;
    let $componentController;

    function createController(bindings = {}) {
      const $ctrl = $componentController('inventoryContainer', { $scope: scope }, bindings);
      if ($ctrl.$onInit) $ctrl.$onInit();
      return $ctrl;
    }

    beforeEach(() => {
      window.module('ui.router');
      window.module(ngModule.name);
      window.module(($provide) => {
        $provide.factory('productsFactory', () => ({ getNumUniqueProducts: () => new Promise(resolve => resolve()), getTotalQuantity: () => new Promise(resolve => resolve()), getInventoryValue: () => new Promise(resolve => resolve()), getProducts: () => new Promise(resolve => resolve()), getProductCategories: () => new Promise(resolve => resolve()) }));
      });
      window.module(($provide) => {
        $provide.factory('globalFiltersFactory', () => ({ getFilter: () => {}, onFilterChange: () => {} }));
      });
      window.module(($provide) => {
        $provide.factory('SAMPLE_APP', () => ({}));
      });
      window.module(($provide) => {
        $provide.value('productTableHeader', []);
      });
    });

    beforeEach(inject(($rootScope, _$componentController_) => {
      scope = $rootScope.$new();
      $componentController = _$componentController_;
    }));

    it('should instantiate', () => {
      const $ctrl = createController({});
      expect($ctrl).to.not.equal(undefined);
    });
  });
};
