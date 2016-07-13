module.exports = ngModule => {
  describe('component:loadingMask', () => {
    let scope;
    let $componentController;

    function createController(bindings = {}) {
      const $ctrl = $componentController('loadingMask', { $scope: scope }, bindings);
      if ($ctrl.$onInit) $ctrl.$onInit();
      return $ctrl;
    }

    beforeEach(() => {
      window.module(ngModule.name);
      window.module(($provide) => {
        $provide.factory('$element', () => ({ addClass: () => {}, removeClass: () => {} }));
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
