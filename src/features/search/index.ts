/**
 * API pública de la feature `search`.
 *
 * Importar desde fuera de esta feature siempre por aquí, nunca de subpaths.
 */

export { rankProducts, type RankedProduct } from "./domain/ranking";
export { addRecent } from "./domain/recent";

export {
  useSearchHistory,
  SEARCH_HISTORY_STORAGE_KEY,
  type SearchHistoryState,
} from "./store/useSearchHistory";

export { SearchBar, type SearchBarProps } from "./ui/SearchBar";
export {
  SearchResultsList,
  type SearchResultsListProps,
} from "./ui/SearchResultsList";
