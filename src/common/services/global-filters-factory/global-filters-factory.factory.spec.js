module.exports = ngModule => {
  describe('factory:globalFiltersFactory', () => {
    let globalFiltersFactory;

    beforeEach(window.module(ngModule.name));

    beforeEach(inject(_globalFiltersFactory_ => {
      globalFiltersFactory = _globalFiltersFactory_;
    }));

    it('should test properly', () => {
      expect(globalFiltersFactory).to.not.equal(undefined);
    });
  });
};
