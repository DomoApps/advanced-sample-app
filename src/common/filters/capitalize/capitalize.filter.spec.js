module.exports = ngModule => {
  describe('Filter:capitalize', () => {
    let capitalize;

    beforeEach(window.module(ngModule.name));

    beforeEach(inject(_capitalize_ => {
      capitalize = _capitalize_;
    }));

    it('should test properly', () => {
      expect(capitalize).to.not.equal(undefined);
    });
  });
};
