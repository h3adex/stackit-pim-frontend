// TypeScript interfaces for STACKIT PIM application

export interface StackitService {
  title: string;
  id: string;
  sku: string;
  region: string;
  category: string;
  product: string;
  name: string;
  unit: string;
  unitBilling: string;
  maturityModelState: string;
  documentation?: string | null;
  price: string;
  monthlyPrice: string;
  currency: string;
  generalProductGroup?: string;
  priceListVisibility?: string;
  deprecated?: string | null;
  attributes?: {
    cfUniqueIds?: string[];
    flavor?: string;
    hardware?: string;
    metro?: boolean;
    os?: string | null;
    ram?: number;
    vCPU?: number;
    [key: string]: any;
  };
}

export interface StackitData {
  lastUpdatedAt: string;
  services: StackitService[];
}

export interface FilterState {
  product: string;
  category: string;
  region: string;
  maturity: string;
  cpu: string;
  memory: string;
}

export interface SortState {
  column: keyof StackitService | null;
  direction: 'asc' | 'desc';
}

export interface PaginationState {
  currentPage: number;
  entriesPerPage: number;
  totalEntries: number;
}

export interface AppState {
  data: StackitService[];
  filteredData: StackitService[];
  filters: FilterState;
  sort: SortState;
  pagination: PaginationState;
  globalSearch: string;
  isLoading: boolean;
  error: string | null;
}

// Filter options for dropdowns
export interface FilterOptions {
  products: string[];
  categories: string[];
  regions: string[];
  maturities: string[];
  cpuCounts: string[];
  ramSizes: string[];
}

// Component props interfaces
export interface HeaderProps {
  globalSearch: string;
  onSearchChange: (search: string) => void;
  entriesPerPage: number;
  onEntriesPerPageChange: (entries: number) => void;
}

export interface FilterPanelProps {
  filters: FilterState;
  filterOptions: FilterOptions;
  onFiltersChange: (filters: Partial<FilterState>) => void;
  onClearFilters: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export interface DataTableProps {
  data: StackitService[];
  sort: SortState;
  onSortChange: (column: keyof StackitService) => void;
  isLoading: boolean;
}

export interface PaginationProps {
  pagination: PaginationState;
  onPageChange: (page: number) => void;
}

export interface UploadPanelProps {
  onFileUpload: (data: StackitService[]) => void;
}