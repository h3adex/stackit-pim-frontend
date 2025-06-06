import React, { useState, useEffect } from 'react';
import type { FilterState } from '../types';
import Button from './ui/Button';
import Select from './ui/Select';
import styles from './FilterPanel.module.css';

interface FilterOptions {
  products: string[];
  categories: string[];
  regions: string[];
  maturities: string[];
  cpuCounts: number[];
  ramSizes: number[];
}

interface FilterPanelProps {
  filters: FilterState;
  filterOptions: FilterOptions;
  onFiltersChange: (filters: Partial<FilterState>) => void;
  onClearFilters: () => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({
  filters,
  filterOptions,
  onFiltersChange,
  onClearFilters
}) => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [showUrlIndicator, setShowUrlIndicator] = useState(false);

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    onFiltersChange({ [key]: value });
  };

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const hasActiveFilters = Object.values(filters).some(filter => filter !== '');

  // Check if filters were loaded from URL on mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const hasUrlFilters = Array.from(urlParams.keys()).some(key => 
      ['product', 'category', 'region', 'maturity', 'cpu', 'memory', 'search'].includes(key)
    );
    
    if (hasUrlFilters) {
      setShowUrlIndicator(true);
      setIsCollapsed(false); // Auto-expand when URL filters are present
      
      // Hide the indicator after 5 seconds
      setTimeout(() => {
        setShowUrlIndicator(false);
      }, 5000);
    }
  }, []);

  return (
    <div className={styles.filtersPanel}>
      {/* URL Filters Indicator */}
      {showUrlIndicator && (
        <div style={{
          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          color: 'white',
          padding: '0.75rem 1rem',
          borderRadius: 'var(--radius-lg)',
          marginBottom: '1rem',
          fontSize: '0.9rem',
          fontWeight: '600',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          boxShadow: 'var(--shadow-sm)',
          animation: 'slideInDown 0.3s ease-out'
        }}>
          <i className="fas fa-link"></i>
          Filters loaded from shared URL
          <button
            onClick={() => setShowUrlIndicator(false)}
            style={{
              background: 'none',
              border: 'none',
              color: 'white',
              cursor: 'pointer',
              marginLeft: 'auto',
              padding: '0.25rem',
              borderRadius: '50%',
              opacity: 0.8,
              transition: 'opacity 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
            onMouseLeave={(e) => e.currentTarget.style.opacity = '0.8'}
          >
            <i className="fas fa-times"></i>
          </button>
        </div>
      )}

      {/* Filter Header */}
      <div className={styles.filtersHeader}>
        <h3 className={styles.filtersHeader}>
          <i className="fa-solid fa-sliders"></i>
          Filters
          {hasActiveFilters && (
            <span style={{
              background: 'var(--accent-color)',
              color: 'white',
              fontSize: '0.75rem',
              fontWeight: '700',
              padding: '0.25rem 0.5rem',
              borderRadius: '50px',
              marginLeft: '0.5rem'
            }}>
              {Object.values(filters).filter(f => f !== '').length}
            </span>
          )}
        </h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleCollapse}
          icon={
            isCollapsed
              ? <i className="fa-solid fa-chevron-down"></i>
              : <i className="fa-solid fa-chevron-up"></i>
          }
          iconPosition="right"
        >
          {isCollapsed ? 'Show' : 'Hide'}
        </Button>
      </div>

      {/* Filter Content */}
      <div
        className={
          isCollapsed
            ? `${styles.filtersContent} ${styles.filtersContentCollapsed}`
            : styles.filtersContent
        }
      >
        <div className={styles.filterGrid}>
          {/* Product Filter */}
          <div>
            <label className={styles.filterItemLabel}>
              <i className="fa-solid fa-box"></i> Product
            </label>
            <Select
              options={filterOptions.products.map(product => ({
                value: product,
                label: product
              }))}
              value={filters.product}
              onChange={(value) => handleFilterChange('product', value)}
              placeholder="All Products"
            />
          </div>

          {/* Category Filter */}
          <div>
            <label className={styles.filterItemLabel}>
              <i className="fa-solid fa-tags"></i> Category
            </label>
            <Select
              options={filterOptions.categories.map(category => ({
                value: category,
                label: category
              }))}
              value={filters.category}
              onChange={(value) => handleFilterChange('category', value)}
              placeholder="All Categories"
            />
          </div>

          {/* Region Filter */}
          <div>
            <label className={styles.filterItemLabel}>
              <i className="fa-solid fa-globe"></i> Region
            </label>
            <Select
              options={filterOptions.regions.map(region => ({
                value: region,
                label: region.toUpperCase()
              }))}
              value={filters.region}
              onChange={(value) => handleFilterChange('region', value)}
              placeholder="All Regions"
            />
          </div>

          {/* Maturity Filter */}
          <div>
            <label className={styles.filterItemLabel}>
              <i className="fa-solid fa-star"></i> Maturity
            </label>
            <Select
              options={filterOptions.maturities.map(maturity => ({
                value: maturity,
                label: maturity.charAt(0).toUpperCase() + maturity.slice(1)
              }))}
              value={filters.maturity}
              onChange={(value) => handleFilterChange('maturity', value)}
              placeholder="All States"
            />
          </div>

          {/* CPU Filter */}
          <div>
            <label className={styles.filterItemLabel}>
              <i className="fa-solid fa-microchip"></i> vCPU Count
            </label>
            <Select
              options={filterOptions.cpuCounts.map(count => ({
                value: count.toString(),
                label: `${count} vCPU${count !== 1 ? 's' : ''}`
              }))}
              value={filters.cpu}
              onChange={(value) => handleFilterChange('cpu', value)}
              placeholder="All vCPU Counts"
            />
          </div>

          {/* Memory Filter */}
          <div>
            <label className={styles.filterItemLabel}>
              <i className="fa-solid fa-memory"></i> RAM (GB)
            </label>
            <Select
              options={filterOptions.ramSizes.map(size => ({
                value: size.toString(),
                label: `${size} GB`
              }))}
              value={filters.memory}
              onChange={(value) => handleFilterChange('memory', value)}
              placeholder="All RAM Sizes"
            />
          </div>

          {/* Clear Filters Button */}
          <div>
            <Button
              variant="danger"
              size="md"
              onClick={onClearFilters}
              disabled={!hasActiveFilters}
              icon={<i className="fa-solid fa-trash"></i>}
              className="w-full"
            >
              Clear All
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;