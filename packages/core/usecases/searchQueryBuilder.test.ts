import { buildSearchQuery } from "./searchQueryBuilder";

describe("buildSearchQuery", () => {
  it("builds the DSL sample correctly", () => {
    const query = buildSearchQuery({
      user: "octocat",
      org: "github",
      type: "user",
      inName: true,
      inEmail: true,
      repos: { operator: ">", value: 10 },
      followers: { operator: ">=", value: 100 },
      location: "Seoul",
      language: "TypeScript",
      created: { operator: ">", value: "2020-01-01" },
      sponsor: true
    });
    expect(query).toBe(
      'user:octocat org:github type:user in:name in:email repos:>10 followers:>=100 location:"Seoul" language:TypeScript created:>2020-01-01 sponsor:true'
    );
  });

  it("supports keyword search with minimal filters", () => {
    expect(
      buildSearchQuery({
        keyword: "frontend dev",
        inName: true
      })
    ).toBe("frontend dev in:name");
  });

  it("formats date objects and numeric shorthand", () => {
    const query = buildSearchQuery({
      created: { operator: ">=", value: new Date("2022-03-02T12:00:00Z") },
      repos: 42,
      followers: 0,
      sponsor: false
    });
    expect(query).toBe("repos:42 followers:0 created:>=2022-03-02");
  });
});
