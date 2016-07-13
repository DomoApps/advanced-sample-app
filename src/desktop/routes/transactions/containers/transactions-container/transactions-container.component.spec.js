module.exports = ngModule => {
  describe('component:transactionsContainer', () => {
    let scope;
    let $componentController;

    function createController(bindings = {}) {
      const $ctrl = $componentController('transactionsContainer', { $scope: scope }, bindings);
      if ($ctrl.$onInit) $ctrl.$onInit();
      return $ctrl;
    }

    beforeEach(() => {
      window.module('ui.router');
      window.module(ngModule.name);
      window.module(($provide) => {
        $provide.factory('globalFiltersFactory', () => ({ getFilter: () => {}, onFilterChange: () => {} }));
      });
      window.module(($provide) => {
        $provide.factory('transactionsAnalyticsFactory', () => ({}));
      });
      window.module(($provide) => {
        $provide.factory('$mdColors', () => ({ getThemeColor: () => {} }));
      });
      window.module(($provide) => {
        $provide.factory('summaryFilter', () => ({}));
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
