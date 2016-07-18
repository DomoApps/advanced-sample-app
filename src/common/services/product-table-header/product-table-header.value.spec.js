module.exports = ngModule => {
  describe('factory:productTableHeader', () => {
    let productTableHeader;

    beforeEach(window.module(ngModule.name));

    beforeEach(inject(_productTableHeader_ => {
      productTableHeader = _productTableHeader_;
    }));

    it('should test properly', () => {
      expect(productTableHeader).to.not.equal(undefined);
    });
  });
};
