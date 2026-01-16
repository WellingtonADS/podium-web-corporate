describe.skip("DropdownSelect (removed)", () => {
  it("is no longer exported from the UI index", () => {
    // Import the UI barrel and assert DropdownSelect is not part of the public API
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const UI = require("../index.ts");
    expect(UI).to.not.have.property("DropdownSelect");
  });
});
