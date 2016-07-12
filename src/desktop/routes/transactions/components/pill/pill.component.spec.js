module.exports = ngModule => {
  describe('component:pill', () => {
    let scope;
    let $componentController;

    function createController(bindings = {}) {
      const $ctrl = $componentController('pill', { $scope: scope }, bindings);
      if ($ctrl.$onInit) $ctrl.$onInit();
      return $ctrl;
    }

    beforeEach(() => {
      window.module('ui.router');
      window.module(ngModule.name);
      window.module(($provide) => {
        $provide.factory('$element', () => ({}));
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
