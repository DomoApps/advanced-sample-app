module.exports = ngModule => {
  describe('Filter:summary', () => {
    let $injector;

    beforeEach(window.module(ngModule.name));

    beforeEach(inject((_$injector_) => {
      $injector = _$injector_;
    }));

    it('should test properly', () => {
      expect($injector.has('summaryFilter')).to.not.equal(false);
    });
  });
};
