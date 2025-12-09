export type NumericOperator = ">" | ">=" | "<" | "<=" | "=";

export interface RangeFilter {
  operator: NumericOperator;
  value: number;
}

export interface DateFilter {
  operator: ">" | ">=" | "<" | "<=" | "=";
  value: string | Date;
}

export interface SearchQueryInput {
  keyword?: string;
  user?: string;
  org?: string;
  type?: "user" | "org";
  inName?: boolean;
  inEmail?: boolean;
  repos?: RangeFilter | number;
  followers?: RangeFilter | number;
  location?: string;
  language?: string;
  created?: DateFilter | string;
  sponsor?: boolean;
}

const formatRange = (label: string, range?: RangeFilter | number) => {
  if (range === undefined) return null;
  if (typeof range === "number") return `${label}:${range}`;
  return `${label}:${range.operator}${range.value}`;
};

const formatDateFilter = (filter?: DateFilter | string) => {
  if (!filter) return null;
  if (typeof filter === "string") return `created:${filter}`;
  const value = filter.value instanceof Date ? filter.value.toISOString().split("T")[0] : filter.value;
  return `created:${filter.operator}${value}`;
};

/**
 * Builds a GitHub search query string based on provided DSL-like filters.
 * The function keeps DESC ordering responsibilities to API parameters instead of embedding in the query.
 */
export const buildSearchQuery = (input: SearchQueryInput): string => {
  const tokens: string[] = [];
  if (input.keyword) tokens.push(input.keyword.trim());
  if (input.user) tokens.push(`user:${input.user}`);
  if (input.org) tokens.push(`org:${input.org}`);
  if (input.type) tokens.push(`type:${input.type}`);
  if (input.inName) tokens.push("in:name");
  if (input.inEmail) tokens.push("in:email");
  const repoRange = formatRange("repos", input.repos);
  if (repoRange) tokens.push(repoRange);
  const followerRange = formatRange("followers", input.followers);
  if (followerRange) tokens.push(followerRange);
  if (input.location) tokens.push(`location:"${input.location}"`);
  if (input.language) tokens.push(`language:${input.language}`);
  const createdFilter = formatDateFilter(input.created);
  if (createdFilter) tokens.push(createdFilter);
  // GitHub search only supports sponsor:true (sponsorable). Skip false to avoid zero-hit queries.
  if (input.sponsor) tokens.push(`sponsor:true`);
  return tokens.filter(Boolean).join(" ").trim();
};

export default buildSearchQuery;
