module.exports = ngModule => {
  describe('factory:transactionsAnalyticsFactory', () => {
    let transactionsAnalyticsFactory;

    beforeEach(window.module(ngModule.name));

    beforeEach(inject(_transactionsAnalyticsFactory => {
      transactionsAnalyticsFactory = _transactionsAnalyticsFactory;
    }));

    it('should test properly', () => {
      expect(transactionsAnalyticsFactory).to.not.equal(undefined);
    });
  });
};
