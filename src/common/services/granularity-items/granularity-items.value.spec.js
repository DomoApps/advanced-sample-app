module.exports = ngModule => {
  describe('factory:granularityItems', () => {
    let granularityItems;

    beforeEach(window.module(ngModule.name));

    beforeEach(inject(_granularityItems_ => {
      granularityItems = _granularityItems_;
    }));

    it('should test properly', () => {
      expect(granularityItems).to.not.equal(undefined);
    });
  });
};
