module.exports = ngModule => {
  describe('factory:productsProvider', () => {
    let productsProvider;

    beforeEach(window.module(ngModule.name));

    beforeEach(inject(_productsProvider_ => {
      productsProvider = _productsProvider_;
    }));

    it('should test properly', () => {
      expect(productsProvider).to.not.equal(undefined);
    });
  });
};
