module.exports = ngModule => {
  describe('factory:productsFactory', () => {
    let productsFactory;

    beforeEach(window.module(ngModule.name));

    beforeEach(inject(_productsFactory => {
      productsFactory = _productsFactory;
    }));

    it('should test properly', () => {
      expect(productsFactory).to.not.equal(undefined);
    });
  });
};
