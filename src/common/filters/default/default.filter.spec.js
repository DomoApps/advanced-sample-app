module.exports = ngModule => {
  describe('Filter:default', () => {
    let $injector;

    beforeEach(window.module(ngModule.name));

    beforeEach(inject((_$injector_) => {
      $injector = _$injector_;
    }));

    it('should test properly', () => {
      expect($injector.has('defaultFilter')).to.not.equal(false);
    });
  });
};
