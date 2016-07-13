module.exports = ngModule => {
  describe('factory:transactionsAnalyticsFactory', () => {
    let transactionsAnalyticsFactory;

    beforeEach(window.module(ngModule.name));

    beforeEach(() => {
      window.module(($provide) => {
        $provide.factory('SAMPLE_APP', () => ({}));
      });
      inject(_transactionsAnalyticsFactory_ => {
        transactionsAnalyticsFactory = _transactionsAnalyticsFactory_;
      });
    });

    it('should test properly', () => {
      expect(transactionsAnalyticsFactory).to.not.equal(undefined);
    });
  });
};
