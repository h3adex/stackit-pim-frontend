import React, { useState } from 'react';
import type { StackitService, SortState, FilterState } from '../types';
import ServiceDetailModal from './ServiceDetailModal';
import styles from './DataTable.module.css';

interface DataTableProps {
  data: StackitService[];
  sort: SortState;
  onSortChange: (column: keyof StackitService) => void;
  filters: FilterState; // Add filters prop
  isLoading?: boolean;
}

interface TableHeaderProps {
  column: keyof StackitService;
  children: React.ReactNode;
  sort: SortState;
  onSortChange: (column: keyof StackitService) => void;
  align?: 'left' | 'center' | 'right';
}

const TableHeader: React.FC<TableHeaderProps> = ({ 
  column, 
  children, 
  sort, 
  onSortChange, 
  align = 'left' 
}) => {
  const isActive = sort.column === column;
  const direction = isActive ? sort.direction : null;

  return (
    <th
      onClick={() => onSortChange(column)}
      style={{
        padding: '1rem',
        textAlign: align,
        fontWeight: '600',
        color: 'var(--text-primary)',
        borderBottom: '2px solid var(--border-color)',
        borderRight: '1px solid var(--border-color)',
        position: 'relative',
        whiteSpace: 'nowrap',
        backdropFilter: 'blur(20px)',
        cursor: 'pointer',
        userSelect: 'none',
        transition: 'var(--transition)',
        background: isActive ? 'rgba(79, 172, 254, 0.1)' : 'rgba(255, 255, 255, 0.05)'
      }}
      onMouseEnter={(e) => {
        if (!isActive) {
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
        }
      }}
      onMouseLeave={(e) => {
        if (!isActive) {
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
        }
      }}
    >
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: align === 'center' ? 'center' : align === 'right' ? 'flex-end' : 'space-between',
        gap: '0.5rem'
      }}>
        <span>{children}</span>
        <i 
          className={`fas fa-sort${direction === 'asc' ? '-up' : direction === 'desc' ? '-down' : ''}`}
          style={{
            opacity: isActive ? 1 : 0.3,
            color: isActive ? 'var(--accent-color)' : 'var(--text-muted)',
            fontSize: '0.8rem',
            transition: 'var(--transition)'
          }}
        />
      </div>
    </th>
  );
};

const MaturityBadge: React.FC<{ maturity: string }> = ({ maturity }) => {
  const getMaturityConfig = (state: string) => {
    switch (state.toLowerCase()) {
      case 'beta':
        return {
          icon: 'fas fa-flask',
          background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
          color: '#1f2937'
        };
      case 'ga':
        return {
          icon: 'fas fa-check-circle',
          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          color: 'white'
        };
      case 'alpha':
        return {
          icon: 'fas fa-exclamation-triangle',
          background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
          color: 'white'
        };
      case 'deprecated':
        return {
          icon: 'fas fa-times-circle',
          background: 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)',
          color: 'white'
        };
      default:
        return {
          icon: 'fas fa-question-circle',
          background: 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)',
          color: 'white'
        };
    }
  };

  const config = getMaturityConfig(maturity);

  return (
    <span
      style={{
        padding: '0.5rem 1rem',
        borderRadius: 'var(--radius-lg)',
        fontSize: '0.75rem',
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: '1px',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.4rem',
        boxShadow: 'var(--shadow-sm)',
        transition: 'var(--transition)',
        background: config.background,
        color: config.color,
        border: `1px solid ${config.color === 'white' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)'}`
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = 'var(--shadow-md)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
      }}
    >
      <i className={config.icon}></i>
      {maturity}
    </span>
  );
};

const RegionBadge: React.FC<{ region: string }> = ({ region }) => (
  <span
    style={{
      padding: '0.4rem 0.8rem',
      background: 'var(--accent-gradient)',
      color: 'white',
      borderRadius: 'var(--radius-lg)',
      fontSize: '0.8rem',
      fontWeight: '600',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
      boxShadow: 'var(--shadow-sm)',
      display: 'inline-block'
    }}
  >
    {region}
  </span>
);

const SkuBadge: React.FC<{ sku: string }> = ({ sku }) => (
  <span
    style={{
      fontFamily: "'JetBrains Mono', 'Courier New', monospace",
      fontSize: '0.8rem',
      color: 'var(--accent-color)',
      background: 'rgba(79, 172, 254, 0.15)',
      padding: '0.4rem 0.8rem',
      borderRadius: 'var(--radius-sm)',
      border: '1px solid rgba(79, 172, 254, 0.3)',
      display: 'inline-block',
      fontWeight: '600',
      letterSpacing: '0.5px'
    }}
  >
    {sku}
  </span>
);

// New components for CPU and Memory badges
const CpuBadge: React.FC<{ cpu: number | string }> = ({ cpu }) => (
  <span
    style={{
      padding: '0.4rem 0.8rem',
      background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
      color: 'white',
      borderRadius: 'var(--radius-lg)',
      fontSize: '0.8rem',
      fontWeight: '600',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.4rem',
      boxShadow: 'var(--shadow-sm)',
      border: '1px solid rgba(255,255,255,0.2)'
    }}
  >
    <i className="fas fa-microchip"></i>
    {cpu}
  </span>
);

const MemoryBadge: React.FC<{ memory: number | string }> = ({ memory }) => (
  <span
    style={{
      padding: '0.4rem 0.8rem',
      background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
      color: 'white',
      borderRadius: 'var(--radius-lg)',
      fontSize: '0.8rem',
      fontWeight: '600',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.4rem',
      boxShadow: 'var(--shadow-sm)',
      border: '1px solid rgba(255,255,255,0.2)'
    }}
  >
    <i className="fas fa-memory"></i>
    {memory} GB
  </span>
);

const DataTable: React.FC<DataTableProps> = ({ 
  data, 
  sort, 
  onSortChange, 
  filters,
  isLoading = false
}) => {
  const [selectedService, setSelectedService] = useState<StackitService | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Show both CPU and Memory columns when either filter is active
  const showResourceColumns = filters.cpu !== '' || filters.memory !== '';
  const showCpuColumn = showResourceColumns;
  const showMemoryColumn = showResourceColumns;

  const handleRowClick = (service: StackitService) => {
    setSelectedService(service);
    setIsDetailModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsDetailModalOpen(false);
    setSelectedService(null);
  };
  
  const formatPrice = (price: string, currency: string = '€', billing: string = '') => {
    if (!price) return '';
    const numPrice = parseFloat(price);
    if (isNaN(numPrice)) return price;
    return `${numPrice.toFixed(6)} ${currency} ${billing}`.trim();
  };

  const formatMonthlyPrice = (price: string, currency: string = '€') => {
    if (!price) return '';
    const numPrice = parseFloat(price);
    if (isNaN(numPrice)) return price;
    return `${numPrice.toFixed(2)} ${currency}`.trim();
  };

  // Calculate colspan for loading/empty states
  const baseColumns = 8; // Original columns
  const dynamicColumns = (showCpuColumn ? 1 : 0) + (showMemoryColumn ? 1 : 0);
  const totalColumns = baseColumns + dynamicColumns;

  return (
      <div className="data-panel" style={{
        background: 'var(--bg-glass)',
        backdropFilter: 'blur(20px)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-xl) var(--radius-xl) 0 0',
        boxShadow: 'var(--shadow-xl)',
        overflow: 'hidden'
      }}>
      {/* Panel Header */}
      <div className="panel-header" style={{
        padding: '1.5rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid var(--border-color)',
        background: 'rgba(255, 255, 255, 0.02)',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div className="stats-section">
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            color: 'var(--text-secondary)',
            fontWeight: '500'
          }}>
            {/* Show indicator when dynamic columns are active */}
            {showResourceColumns && (
              <div style={{
                fontSize: '0.85rem',
                color: 'var(--accent-color)',
                background: 'rgba(79, 172, 254, 0.1)',
                padding: '0.25rem 0.75rem',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid rgba(79, 172, 254, 0.3)'
              }}>
                <i className="fas fa-columns"></i> Extended view • CPU & Memory
              </div>
            )}
          </div>
        </div>
      </div>
      <div className={styles.tableWrapper}>
        <div className={styles.tableContainer}>
          <table className={styles.dataTable}>
            <thead>
              <tr>
                <TableHeader column="title" sort={sort} onSortChange={onSortChange}>
                  Title
                </TableHeader>
                <TableHeader column="product" sort={sort} onSortChange={onSortChange}>
                  Product
                </TableHeader>
                <TableHeader column="sku" sort={sort} onSortChange={onSortChange}>
                  SKU
                </TableHeader>
                <TableHeader column="category" sort={sort} onSortChange={onSortChange}>
                  Category
                </TableHeader>
                {/* Conditionally render CPU column */}
                {showCpuColumn && (
                  <th
                    style={{
                      padding: '1rem',
                      textAlign: 'center',
                      fontWeight: '600',
                      color: 'var(--text-primary)',
                      borderBottom: '2px solid var(--border-color)',
                      borderRight: '1px solid var(--border-color)',
                      position: 'relative',
                      whiteSpace: 'nowrap',
                      backdropFilter: 'blur(20px)',
                      background: 'rgba(255, 255, 255, 0.05)'
                    }}
                  >
                    vCPU
                  </th>
                )}
                {/* Conditionally render Memory column */}
                {showMemoryColumn && (
                  <th
                    style={{
                      padding: '1rem',
                      textAlign: 'center',
                      fontWeight: '600',
                      color: 'var(--text-primary)',
                      borderBottom: '2px solid var(--border-color)',
                      borderRight: '1px solid var(--border-color)',
                      position: 'relative',
                      whiteSpace: 'nowrap',
                      backdropFilter: 'blur(20px)',
                      background: 'rgba(255, 255, 255, 0.05)'
                    }}
                  >
                    Memory
                  </th>
                )}
                <TableHeader column="price" sort={sort} onSortChange={onSortChange} align="right">
                  Price/Unit
                </TableHeader>
                <TableHeader column="monthlyPrice" sort={sort} onSortChange={onSortChange} align="right">
                  Monthly Price
                </TableHeader>
                <TableHeader column="region" sort={sort} onSortChange={onSortChange} align="center">
                  Region
                </TableHeader>
                <TableHeader column="maturityModelState" sort={sort} onSortChange={onSortChange} align="center">
                  Maturity
                </TableHeader>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td 
                    colSpan={totalColumns} 
                    style={{
                      textAlign: 'center',
                      padding: '3rem',
                      color: 'var(--text-muted)',
                      fontSize: '1.1rem'
                    }}
                  >
                    <div className="loading" style={{ marginRight: '1rem', display: 'inline-block' }}></div>
                    Loading data...
                  </td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td 
                    colSpan={totalColumns} 
                    style={{
                      textAlign: 'center',
                      padding: '3rem',
                      color: 'var(--text-muted)',
                      fontSize: '1.1rem',
                      fontStyle: 'italic'
                    }}
                  >
                    <i className="fas fa-search" style={{ fontSize: '2rem', marginBottom: '1rem', display: 'block', opacity: 0.5 }}></i>
                    No matching records found
                  </td>
                </tr>
              ) : (
                data.map((item, index) => (
                  <tr 
                    key={item.id || `${item.sku}-${index}`}
                    style={{
                      transition: 'var(--transition)',
                      borderBottom: '1px solid var(--border-color)',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                      e.currentTarget.style.transform = 'scale(1.001)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.transform = 'scale(1)';
                    }}
                    onClick={() => handleRowClick(item)}
                    title="Click to view details"
                  >
                    <td 
                      style={{
                        padding: '1rem',
                        borderRight: '1px solid rgba(255, 255, 255, 0.05)',
                        fontWeight: '600',
                        color: 'var(--text-primary)',
                        maxWidth: '250px',
                        wordWrap: 'break-word'
                      }}
                    >
                      {item.title}
                    </td>
                    <td 
                      style={{
                        padding: '1rem',
                        borderRight: '1px solid rgba(255, 255, 255, 0.05)',
                        color: 'var(--text-secondary)'
                      }}
                    >
                      {item.product}
                    </td>
                    <td 
                      style={{
                        padding: '1rem',
                        borderRight: '1px solid rgba(255, 255, 255, 0.05)'
                      }}
                    >
                      <SkuBadge sku={item.sku} />
                    </td>
                    <td 
                      style={{
                        padding: '1rem',
                        borderRight: '1px solid rgba(255, 255, 255, 0.05)',
                        color: 'var(--text-secondary)'
                      }}
                    >
                      {item.category}
                    </td>
                    {/* Conditionally render CPU cell */}
                    {showCpuColumn && (
                      <td 
                        style={{
                          padding: '1rem',
                          borderRight: '1px solid rgba(255, 255, 255, 0.05)',
                          textAlign: 'center'
                        }}
                      >
                        {item.attributes?.vCPU ? <CpuBadge cpu={item.attributes.vCPU} /> : '-'}
                      </td>
                    )}
                    {/* Conditionally render Memory cell */}
                    {showMemoryColumn && (
                      <td 
                        style={{
                          padding: '1rem',
                          borderRight: '1px solid rgba(255, 255, 255, 0.05)',
                          textAlign: 'center'
                        }}
                      >
                        {item.attributes?.ram ? <MemoryBadge memory={item.attributes.ram} /> : '-'}
                      </td>
                    )}
                    <td 
                      style={{
                        padding: '1rem',
                        borderRight: '1px solid rgba(255, 255, 255, 0.05)',
                        textAlign: 'right',
                        fontFamily: "'JetBrains Mono', 'Courier New', monospace",
                        fontSize: '0.85rem',
                        fontWeight: '600',
                        color: 'var(--success-color)',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {formatPrice(item.price, item.currency, item.unitBilling)}
                    </td>
                    <td 
                      style={{
                        padding: '1rem',
                        borderRight: '1px solid rgba(255, 255, 255, 0.05)',
                        textAlign: 'right',
                        fontFamily: "'JetBrains Mono', 'Courier New', monospace",
                        fontSize: '0.85rem',
                        fontWeight: '600',
                        color: 'var(--success-color)',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {formatMonthlyPrice(item.monthlyPrice, item.currency)}
                    </td>
                    <td 
                      style={{
                        padding: '1rem',
                        borderRight: '1px solid rgba(255, 255, 255, 0.05)',
                        textAlign: 'center'
                      }}
                    >
                      <RegionBadge region={item.region} />
                    </td>
                    <td 
                      style={{
                        padding: '1rem',
                        textAlign: 'center'
                      }}
                    >
                      <MaturityBadge maturity={item.maturityModelState} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Service Detail Modal */}
      <ServiceDetailModal
        service={selectedService}
        isOpen={isDetailModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default DataTable;
