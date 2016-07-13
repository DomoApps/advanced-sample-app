module.exports = ngModule => {
  describe('factory:globalFiltersFactory', () => {
    let globalFiltersFactory;

    beforeEach(window.module(ngModule.name));

    beforeEach(() => {
      window.module(($provide) => {
        $provide.factory('daEvents', () => ({}));
        $provide.factory('SAMPLE_APP', () => ({}));
      });
      inject(_globalFiltersFactory_ => {
        globalFiltersFactory = _globalFiltersFactory_;
      });
    });

    it('should test properly', () => {
      expect(globalFiltersFactory).to.not.equal(undefined);
    });
  });
};
