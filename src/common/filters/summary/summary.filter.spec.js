module.exports = ngModule => {
  describe('Filter:summary', () => {
    let summary;

    beforeEach(window.module(ngModule.name));

    beforeEach(inject(_summary_ => {
      summary = _summary_;
    }));

    it('should test properly', () => {
      expect(summary).to.not.equal(undefined);
    });
  });
};
