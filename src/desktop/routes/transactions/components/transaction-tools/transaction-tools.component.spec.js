module.exports = ngModule => {
  describe('component:transactionTools', () => {
    let scope;
    let $componentController;

    function createController(bindings = {
      onGranularityDropdownSelect: () => {},
      onDateRangeDropdownSelect: () => {},
    }) {
      const $ctrl = $componentController('transactionTools', { $scope: scope }, bindings);
      $ctrl.onGranularityDropdownSelect = () => {};
      $ctrl.onDateRangeDropdownSelect = () => {};
      if ($ctrl.$onInit) $ctrl.$onInit();
      return $ctrl;
    }

    beforeEach(() => {
      window.module('ui.router');
      window.module(ngModule.name);
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
