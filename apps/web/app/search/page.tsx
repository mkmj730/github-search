import { searchGitHubUsers } from "@data/apiClient";
import SearchResult from "../../components/SearchResult";
import PageHeader from "../../components/PageHeader";
import type { FilterState } from "@ui/FilterPanel";

export default async function SearchPage({ searchParams }: { searchParams?: { q?: string } }) {
  const keyword = searchParams?.q ?? "";
  const initialFilters: FilterState & { keyword: string } = {
    keyword,
    location: "",
    language: "",
    repos: "",
    followers: "",
    sponsor: false,
    created: "",
    inName: true,
    inEmail: false,
    type: "any"
  };
  const initial = await searchGitHubUsers({
    filters: {
      keyword: initialFilters.keyword,
      type: initialFilters.type === "any" ? undefined : (initialFilters.type as "user" | "org"),
      inName: initialFilters.inName,
      inEmail: initialFilters.inEmail,
      created: initialFilters.created || undefined
    },
    perPage: 10,
    order: "desc"
  }).catch(() => ({
    totalCount: 0,
    items: [],
    rateLimitRemaining: 0
  }));

  return (
    <main className="p-6 md:p-10 space-y-6">
      <PageHeader
        title="GitHub User Search"
        subtitle="SSR first page, CSR infinite scroll. Dark mode follows system."
      />
      <SearchResult initialResult={initial} initialFilters={initialFilters} />
    </main>
  );
}
