module.exports = ngModule => {
  describe('factory:productsFactory', () => {
    let productsFactory;

    beforeEach(window.module(ngModule.name));

    beforeEach(() => {
      window.module(($provide) => {
        $provide.factory('SAMPLE_APP', () => ({}));
      });
      inject(_productsFactory_ => {
        productsFactory = _productsFactory_;
      });
    });

    it('should test properly', () => {
      expect(productsFactory).to.not.equal(undefined);
    });
  });
};
