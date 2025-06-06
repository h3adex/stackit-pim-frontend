import React, { useState, useEffect, useMemo, useCallback } from 'react';
import type { StackitService, StackitData, FilterState, SortState } from './types';
import Header from './components/Header';
import FilterPanel from './components/FilterPanel';
import DataTable from './components/DataTable';
import Pagination from './components/Pagination';
import styles from './App.module.css';

const App: React.FC = () => {
  const [data, setData] = useState<StackitService[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [globalSearch, setGlobalSearch] = useState('');
  const [filters, setFilters] = useState<FilterState>({
    product: '',
    category: '',
    region: '',
    maturity: '',
    cpu: '',
    memory: ''
  });
  
  const [sort, setSort] = useState<SortState>({
    column: null,
    direction: 'asc'
  });
  
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(50);
  const [showCopiedFeedback, setShowCopiedFeedback] = useState(false);

  // URL parameter management
  const updateURL = useCallback((newFilters: FilterState, search: string, page: number, entries: number) => {
    const params = new URLSearchParams();
    
    // Only add non-empty filters to URL
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      }
    });
    
    // Add other parameters if they're not default values
    if (search) params.set('search', search);
    if (page > 1) params.set('page', page.toString());
    if (entries !== 50) params.set('entries', entries.toString());
    
    // Update URL without triggering a page reload
    const newUrl = params.toString() ? `${window.location.pathname}?${params.toString()}` : window.location.pathname;
    window.history.replaceState(null, '', newUrl);
  }, []);

  // Load filters from URL on component mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    
    const urlFilters: FilterState = {
      product: urlParams.get('product') || '',
      category: urlParams.get('category') || '',
      region: urlParams.get('region') || '',
      maturity: urlParams.get('maturity') || '',
      cpu: urlParams.get('cpu') || '',
      memory: urlParams.get('memory') || ''
    };
    
    const urlSearch = urlParams.get('search') || '';
    const urlPage = parseInt(urlParams.get('page') || '1');
    const urlEntries = parseInt(urlParams.get('entries') || '50');
    
    setFilters(urlFilters);
    setGlobalSearch(urlSearch);
    setCurrentPage(urlPage);
    setEntriesPerPage(urlEntries);
  }, []);

  // Update URL whenever filters, search, page, or entries change
  useEffect(() => {
    if (!isLoading) { // Only update URL after initial load
      updateURL(filters, globalSearch, currentPage, entriesPerPage);
    }
  }, [filters, globalSearch, currentPage, entriesPerPage, isLoading, updateURL]);

  // Load products.json data
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await fetch('/data/products.json');
        
        if (!response.ok) {
          throw new Error(`Failed to load products.json: ${response.status}`);
        }
        
        const jsonData: StackitData | StackitService[] = await response.json();
        
        const services = Array.isArray(jsonData) 
          ? jsonData 
          : jsonData.services || [];
        
        if (!services.length) {
          throw new Error('No services found in products.json');
        }
        
        setData(services);
        console.log(`Loaded ${services.length} services from products.json`);
        
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
        setError(errorMessage);
        console.error('Failed to load data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Helper functions
  const getCpuCount = useCallback((item: StackitService): number | null => {
    return item.attributes?.vCPU ?? null;
  }, []);

  const getRamSize = useCallback((item: StackitService): number | null => {
    return item.attributes?.ram ?? null;
  }, []);

  // Generate filter options
  const filterOptions = useMemo(() => {
    const products = [...new Set(data.map(item => item.product).filter(Boolean))].sort();
    const categories = [...new Set(data.map(item => item.category).filter(Boolean))].sort();
    const regions = [...new Set(data.map(item => item.region).filter(Boolean))].sort();
    const maturities = [...new Set(data.map(item => item.maturityModelState).filter(Boolean))].sort();
    
    const cpuCounts = [...new Set(
      data
        .map(getCpuCount)
        .filter((count): count is number => count !== null)
    )].sort((a, b) => a - b);
    
    const ramSizes = [...new Set(
      data
        .map(getRamSize)
        .filter((size): size is number => size !== null)
    )].sort((a, b) => a - b);

    return {
      products,
      categories,
      regions,
      maturities,
      cpuCounts,
      ramSizes
    };
  }, [data, getCpuCount, getRamSize]);

  // Apply all filters
  const filteredData = useMemo(() => {
    let result = data;

    // Global search
    if (globalSearch.trim()) {
      const searchTerm = globalSearch.toLowerCase();
      result = result.filter(item =>
        Object.values(item).some(value =>
          value?.toString().toLowerCase().includes(searchTerm)
        )
      );
    }

    // Individual filters
    if (filters.product) {
      result = result.filter(item => item.product === filters.product);
    }
    if (filters.category) {
      result = result.filter(item => item.category === filters.category);
    }
    if (filters.region) {
      result = result.filter(item => item.region === filters.region);
    }
    if (filters.maturity) {
      result = result.filter(item => item.maturityModelState === filters.maturity);
    }
    if (filters.cpu) {
      const cpuCount = parseInt(filters.cpu);
      result = result.filter(item => getCpuCount(item) === cpuCount);
    }
    if (filters.memory) {
      const ramSize = parseInt(filters.memory);
      result = result.filter(item => getRamSize(item) === ramSize);
    }

    return result;
  }, [data, globalSearch, filters, getCpuCount, getRamSize]);

  // Apply sorting
  const sortedData = useMemo(() => {
    if (!sort.column) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aVal = a[sort.column!];
      const bVal = b[sort.column!];

      // Handle numeric columns
      if (sort.column === 'price' || sort.column === 'monthlyPrice') {
        const aNum = parseFloat(aVal as string) || 0;
        const bNum = parseFloat(bVal as string) || 0;
        return sort.direction === 'asc' ? aNum - bNum : bNum - aNum;
      }

      // Handle string columns
      const aStr = (aVal || '').toString().toLowerCase();
      const bStr = (bVal || '').toString().toLowerCase();
      
      if (aStr < bStr) return sort.direction === 'asc' ? -1 : 1;
      if (aStr > bStr) return sort.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredData, sort]);

  // Apply pagination
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * entriesPerPage;
    return sortedData.slice(startIndex, startIndex + entriesPerPage);
  }, [sortedData, currentPage, entriesPerPage]);

  const totalPages = Math.ceil(sortedData.length / entriesPerPage);

  // Event handlers
  const handleSearchChange = useCallback((search: string) => {
    setGlobalSearch(search);
    setCurrentPage(1);
  }, []);

  const handleEntriesPerPageChange = useCallback((entries: number) => {
    setEntriesPerPage(entries);
    setCurrentPage(1);
  }, []);

  const handleFiltersChange = useCallback((newFilters: Partial<FilterState>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setCurrentPage(1);
  }, []);

  const handleClearFilters = useCallback(() => {
    setFilters({
      product: '',
      category: '',
      region: '',
      maturity: '',
      cpu: '',
      memory: ''
    });
    setGlobalSearch('');
    setCurrentPage(1);
  }, []);

  const handleSortChange = useCallback((column: keyof StackitService) => {
    setSort(prev => ({
      column,
      direction: prev.column === column && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  // Export to CSV
  const handleExport = useCallback(() => {
    if (!sortedData.length) {
      alert('No data to export');
      return;
    }

    const headers = [
      'Title', 'Product', 'SKU', 'Category', 'Price', 'Monthly Price', 
      'Region', 'Maturity State', 'vCPU Count', 'RAM (GB)'
    ];
    
    const csvContent = [
      headers.join(','),
      ...sortedData.map(item => [
        `"${item.title?.replace(/"/g, '""') || ''}"`,
        `"${item.product?.replace(/"/g, '""') || ''}"`,
        `"${item.sku?.replace(/"/g, '""') || ''}"`,
        `"${item.category?.replace(/"/g, '""') || ''}"`,
        `"${item.price?.replace(/"/g, '""') || ''}"`,
        `"${item.monthlyPrice?.replace(/"/g, '""') || ''}"`,
        `"${item.region?.replace(/"/g, '""') || ''}"`,
        `"${item.maturityModelState?.replace(/"/g, '""') || ''}"`,
        `"${getCpuCount(item) || ''}"`,
        `"${getRamSize(item) || ''}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    link.href = url;
    link.download = `stackit-pim-export-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    
    URL.revokeObjectURL(url);
  }, [sortedData, getCpuCount, getRamSize]);

  // Share current filters as URL
  const handleShareFilters = useCallback(() => {
    const currentUrl = window.location.href;
    navigator.clipboard.writeText(currentUrl).then(() => {
      // Show subtle feedback instead of alert
      setShowCopiedFeedback(true);
      setTimeout(() => setShowCopiedFeedback(false), 2000);
    }).catch(() => {
      // Fallback for browsers that don't support clipboard API
      const textArea = document.createElement('textarea');
      textArea.value = currentUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      // Show subtle feedback instead of alert
      setShowCopiedFeedback(true);
      setTimeout(() => setShowCopiedFeedback(false), 2000);
    });
  }, []);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="text-center text-white">
          <div className="loading mb-4"></div>
          <p>Loading products data...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="text-center bg-slate-800 border border-slate-700 rounded-xl p-8">
          <div className="text-red-400 text-5xl mb-4">
            <i className="fas fa-exclamation-triangle"></i>
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">Failed to Load Data</h2>
          <p className="text-slate-300 mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
          >
            <i className="fas fa-redo mr-2"></i>
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Check if any filters are active for showing share button
  const hasActiveFilters = Object.values(filters).some(filter => filter !== '') || globalSearch !== '';

  return (
    <div className={styles.appContainer}>
      {/* Animated Background */}
      <div className={styles.backgroundAnimation}>
        <div className={`${styles.floatingShape} ${styles.shape1}`}></div>
        <div className={`${styles.floatingShape} ${styles.shape2}`}></div>
        <div className={`${styles.floatingShape} ${styles.shape3}`}></div>
        <div className={`${styles.floatingShape} ${styles.shape4}`}></div>
      </div>

      <div className={styles.container}>
        <Header
          globalSearch={globalSearch}
          onSearchChange={handleSearchChange}
          entriesPerPage={entriesPerPage}
          onEntriesPerPageChange={handleEntriesPerPageChange}
        />

        {/* Data loaded successfully - show components */}
        {!isLoading && !error && (
          <>
            <FilterPanel
              filters={filters}
              filterOptions={filterOptions}
              onFiltersChange={handleFiltersChange}
              onClearFilters={handleClearFilters}
            />

            {/* Share Filters Button */}
            {hasActiveFilters && (
              <div style={{
                margin: '1rem 0',
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '1rem'
              }}>
                <button
                  onClick={handleShareFilters}
                  style={{
                    background: showCopiedFeedback ? 'var(--success-color)' : 'var(--accent-gradient)',
                    color: 'white',
                    border: 'none',
                    padding: '0.75rem 1.5rem',
                    borderRadius: 'var(--radius-lg)',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    transition: 'var(--transition)',
                    boxShadow: 'var(--shadow-sm)'
                  }}
                  onMouseEnter={(e) => {
                    if (!showCopiedFeedback) {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!showCopiedFeedback) {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                    }
                  }}
                >
                  {showCopiedFeedback ? (
                    <>
                      <i className="fas fa-check"></i>
                      Copied!
                    </>
                  ) : (
                    <>
                      <i className="fas fa-share-alt"></i>
                      Share Filters
                    </>
                  )}
                </button>
              </div>
            )}

            <DataTable
              data={paginatedData}
              sort={sort}
              onSortChange={handleSortChange}
              filters={filters}
              isLoading={isLoading}
            />

            {/* Updated Pagination with integrated CSV Export - Full width like table */}
            <div
              style={{
                position: 'fixed',
                left: '-4px',
                bottom: 0,
                width: '100vw',
                zIndex: 200,
                background: 'var(--bg-primary)',
                boxShadow: '0 -2px 8px rgba(0,0,0,0.15)',
              }}
            >
              {/* Match the exact table container styling and width */}
              <div
                style={{
                  maxWidth: '1600px',
                  margin: '0 auto',
                  padding: '0 2rem', // Match container padding
                }}
              >
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalEntries={sortedData.length}
                  entriesPerPage={entriesPerPage}
                  onPageChange={handlePageChange}
                  onExport={handleExport}
                  exportDisabled={!sortedData.length}
                />
              </div>
            </div>

            {/* Add padding to prevent content overlap */}
            <div style={{ paddingBottom: '5rem' }}></div>
          </>
        )}
      </div>
    </div>
  );
};

export default App;
