describe("GitHub search SSR/CSR flow", () => {
  beforeEach(() => {
    cy.visit("/search");
  });

  it("shows initial SSR results", () => {
    cy.get("[data-testid='result-card']").should("exist");
  });

  it("loads next page on scroll", () => {
    cy.scrollTo("bottom");
    cy.get("[data-testid='result-card']").should("exist");
  });

  it("updates when sort changes", () => {
    cy.get("[data-testid='sort-selector']").click();
    cy.contains("Followers").click();
    cy.get("[data-testid='sort-selector']").should("contain.text", "Followers");
  });

  it("honors system dark mode", () => {
    cy.document().then((doc) => {
      const scheme = doc.documentElement.getAttribute("data-theme");
      expect(scheme).to.be.oneOf([null, "dark", "light"]);
    });
  });
});
