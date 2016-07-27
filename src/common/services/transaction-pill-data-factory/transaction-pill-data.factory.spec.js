module.exports = ngModule => {
  describe('factory:transactionPillDataFactory', () => {
    let transactionPillDataFactory;

    beforeEach(window.module(ngModule.name));

    beforeEach(() => {
      window.module(($provide) => {
        $provide.factory('$mdColors', () => {
          return {
            getThemeColor: () => {
              return '#fff';
            }
          };
        });
      });
      inject(_transactionPillDataFactory_ => {
        transactionPillDataFactory = _transactionPillDataFactory_;
      });
    });

    it('should test properly', () => {
      expect(transactionPillDataFactory).to.not.equal(undefined);
    });
  });
};
