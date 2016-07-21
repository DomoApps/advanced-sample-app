module.exports = ngModule => {
  describe('factory:dateRangeItems', () => {
    let dateRangeItems;

    beforeEach(window.module(ngModule.name));

    beforeEach(inject(_dateRangeItems_ => {
      dateRangeItems = _dateRangeItems_;
    }));

    it('should test properly', () => {
      expect(dateRangeItems).to.not.equal(undefined);
    });
  });
};
