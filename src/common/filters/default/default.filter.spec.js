module.exports = ngModule => {
  describe('Filter:default', () => {
    let default;

    beforeEach(window.module(ngModule.name));

    beforeEach(inject(_default_ => {
      default = _default_;
    }));

    it('should test properly', () => {
      expect(default).to.not.equal(undefined);
    });
  });
};
