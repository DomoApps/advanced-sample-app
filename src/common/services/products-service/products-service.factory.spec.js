module.exports = ngModule => {
  describe('factory:productsService', () => {
    let productsService;

    beforeEach(window.module(ngModule.name));

    beforeEach(inject(_productsService => {
      productsService = _productsService;
    }));

    it('should test properly', () => {
      expect(productsService).to.not.equal(undefined);
    });
  });
};
