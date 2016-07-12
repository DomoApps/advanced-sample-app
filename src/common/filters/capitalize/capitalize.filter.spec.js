module.exports = ngModule => {
  describe('Filter:capitalize', () => {
    let $injector;

    beforeEach(window.module(ngModule.name));

    beforeEach(inject((_$injector_) => {
      $injector = _$injector_;
    }));

    it('should test properly', () => {
      expect($injector.has('capitalizeFilter')).to.not.equal(false);
    });
  });
};
