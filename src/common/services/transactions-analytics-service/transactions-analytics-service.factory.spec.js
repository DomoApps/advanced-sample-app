module.exports = ngModule => {
  describe('factory:transactionsAnalyticsService', () => {
    let transactionsAnalyticsService;

    beforeEach(window.module(ngModule.name));

    beforeEach(inject(_transactionsAnalyticsService_ => {
      transactionsAnalyticsService = _transactionsAnalyticsService_;
    }));

    it('should test properly', () => {
      expect(transactionsAnalyticsService).to.not.equal(undefined);
    });
  });
};
