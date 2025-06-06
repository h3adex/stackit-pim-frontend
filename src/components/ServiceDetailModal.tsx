import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import type { StackitService } from '../types';
import styles from './ServiceDetailModal.module.css';

interface ServiceDetailModalProps {
  service: StackitService | null;
  isOpen: boolean;
  onClose: () => void;
}

const ServiceDetailModal: React.FC<ServiceDetailModalProps> = ({
  service,
  isOpen,
  onClose
}) => {
  // ESC key close
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen || !service) return null;

  const formatPrice = (price: string, currency: string = '€', billing: string = '') => {
    if (!price) return 'N/A';
    const numPrice = parseFloat(price);
    if (isNaN(numPrice)) return price;
    return `${numPrice.toFixed(6)} ${currency} ${billing}`.trim();
  };

  const formatMonthlyPrice = (price: string, currency: string = '€') => {
    if (!price) return 'N/A';
    const numPrice = parseFloat(price);
    if (isNaN(numPrice)) return price;
    return `${numPrice.toFixed(2)} ${currency}`.trim();
  };

  const getMaturityConfig = (state: string) => {
    switch (state.toLowerCase()) {
      case 'beta':
        return { color: '#f59e0b', icon: 'fas fa-flask', label: 'Beta' };
      case 'ga':
        return { color: '#10b981', icon: 'fas fa-check-circle', label: 'Generally Available' };
      case 'alpha':
        return { color: '#f97316', icon: 'fas fa-exclamation-triangle', label: 'Alpha' };
      case 'deprecated':
        return { color: '#6b7280', icon: 'fas fa-times-circle', label: 'Deprecated' };
      default:
        return { color: '#6b7280', icon: 'fas fa-question-circle', label: state };
    }
  };

  const maturityConfig = getMaturityConfig(service.maturityModelState);

  // Helper function to safely render unknown attributes
  const renderAttributeValue = (value: unknown): React.ReactNode => {
    if (value === null || value === undefined) return null;
    return String(value);
  };

  // Helper function to check if attribute should be rendered
  const shouldRenderAttribute = (value: unknown): boolean => {
    return value !== null && value !== undefined;
  };

  // Render modal using portal
  return ReactDOM.createPortal(
    <div className={styles.modalOverlay} onClick={onClose}>
      <div
        className={styles.modalContent}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: '2rem',
            borderBottom: '1px solid var(--border-color)',
            background: 'rgba(255, 255, 255, 0.02)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            gap: '1rem'
          }}
        >
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
              <h2
                style={{
                  fontSize: '1.5rem',
                  fontWeight: '700',
                  color: 'var(--text-primary)',
                  margin: 0,
                  lineHeight: '1.3'
                }}
              >
                {service.title}
              </h2>
              <span
                style={{
                  background: 'var(--accent-gradient)',
                  color: 'white',
                  padding: '0.25rem 0.75rem',
                  borderRadius: 'var(--radius-lg)',
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}
              >
                {service.region}
              </span>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <span
                style={{
                  fontFamily: "'JetBrains Mono', 'Courier New', monospace",
                  fontSize: '0.85rem',
                  color: 'var(--accent-color)',
                  background: 'rgba(79, 172, 254, 0.15)',
                  padding: '0.25rem 0.75rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid rgba(79, 172, 254, 0.3)',
                  fontWeight: '600'
                }}
              >
                {service.sku}
              </span>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <i className={maturityConfig.icon} style={{ color: maturityConfig.color }}></i>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                  {maturityConfig.label}
                </span>
              </div>
            </div>
          </div>
          
          <button
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Close"
            type="button"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>

        {/* Content */}
        <div
          style={{
            padding: '2rem',
            maxHeight: 'calc(90vh - 200px)',
            overflowY: 'auto'
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '2rem'
            }}
          >
            {/* Basic Information */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                padding: '1.5rem',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border-color)'
              }}
            >
              <h3
                style={{
                  fontSize: '1.1rem',
                  fontWeight: '600',
                  color: 'var(--text-primary)',
                  marginBottom: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                <i className="fas fa-info-circle"></i>
                Basic Information
              </h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Product
                  </label>
                  <div style={{ color: 'var(--text-primary)', fontWeight: '500' }}>
                    {service.product || 'N/A'}
                  </div>
                </div>
                
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Category
                  </label>
                  <div style={{ color: 'var(--text-primary)', fontWeight: '500' }}>
                    {service.category || 'N/A'}
                  </div>
                </div>
                
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Name
                  </label>
                  <div style={{ color: 'var(--text-primary)', fontWeight: '500' }}>
                    {service.name || 'N/A'}
                  </div>
                </div>
                
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Unit
                  </label>
                  <div style={{ color: 'var(--text-primary)', fontWeight: '500' }}>
                    {service.unit || 'N/A'}
                  </div>
                </div>
                
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Unit Billing
                  </label>
                  <div style={{ color: 'var(--text-primary)', fontWeight: '500' }}>
                    {service.unitBilling || 'N/A'}
                  </div>
                </div>
              </div>
            </div>

            {/* Pricing Information */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                padding: '1.5rem',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border-color)'
              }}
            >
              <h3
                style={{
                  fontSize: '1.1rem',
                  fontWeight: '600',
                  color: 'var(--text-primary)',
                  marginBottom: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                <i className="fas fa-euro-sign"></i>
                Pricing
              </h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Price per Unit
                  </label>
                  <div
                    style={{
                      color: 'var(--success-color)',
                      fontWeight: '600',
                      fontSize: '1.1rem',
                      fontFamily: "'JetBrains Mono', 'Courier New', monospace"
                    }}
                  >
                    {formatPrice(service.price, service.currency, service.unitBilling)}
                  </div>
                </div>
                
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Monthly Price
                  </label>
                  <div
                    style={{
                      color: 'var(--success-color)',
                      fontWeight: '600',
                      fontSize: '1.1rem',
                      fontFamily: "'JetBrains Mono', 'Courier New', monospace"
                    }}
                  >
                    {formatMonthlyPrice(service.monthlyPrice, service.currency)}
                  </div>
                </div>
                
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Currency
                  </label>
                  <div style={{ color: 'var(--text-primary)', fontWeight: '500' }}>
                    {service.currency || 'N/A'}
                  </div>
                </div>
                
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Price List Visibility
                  </label>
                  <div style={{ color: 'var(--text-primary)', fontWeight: '500' }}>
                    {service.priceListVisibility || 'N/A'}
                  </div>
                </div>
                
                {service.deprecated !== null && (
                  <div>
                    <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Status
                    </label>
                    <div style={{ 
                      color: service.deprecated ? 'var(--error-color)' : 'var(--success-color)', 
                      fontWeight: '500',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}>
                      <i className={service.deprecated ? 'fas fa-exclamation-triangle' : 'fas fa-check-circle'}></i>
                      {service.deprecated ? 'Deprecated' : 'Active'}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Technical Specifications */}
            {service.attributes && (
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  padding: '1.5rem',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--border-color)',
                  gridColumn: 'span 2'
                }}
              >
                <h3
                  style={{
                    fontSize: '1.1rem',
                    fontWeight: '600',
                    color: 'var(--text-primary)',
                    marginBottom: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                >
                  <i className="fas fa-cogs"></i>
                  Technical Specifications
                </h3>
                
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '1rem'
                  }}
                >
                  {service.attributes.vCPU && (
                    <div>
                      <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        vCPU
                      </label>
                      <div style={{ color: 'var(--text-primary)', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <i className="fas fa-microchip" style={{ color: 'var(--accent-color)' }}></i>
                        {service.attributes.vCPU} Core{service.attributes.vCPU !== 1 ? 's' : ''}
                      </div>
                    </div>
                  )}
                  
                  {service.attributes.ram && (
                    <div>
                      <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        RAM
                      </label>
                      <div style={{ color: 'var(--text-primary)', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <i className="fas fa-memory" style={{ color: 'var(--accent-color)' }}></i>
                        {service.attributes.ram} GB
                      </div>
                    </div>
                  )}
                  
                  {shouldRenderAttribute(service.attributes.storage) && (
                    <div>
                      <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        Storage
                      </label>
                      <div style={{ color: 'var(--text-primary)', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <i className="fas fa-hdd" style={{ color: 'var(--accent-color)' }}></i>
                        {renderAttributeValue(service.attributes.storage)}
                      </div>
                    </div>
                  )}
                  
                  {service.attributes.flavor && (
                    <div>
                      <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        Flavor
                      </label>
                      <div style={{ color: 'var(--text-primary)', fontWeight: '500' }}>
                        {String(service.attributes.flavor)}
                      </div>
                    </div>
                  )}
                  
                  {service.attributes.hardware && (
                    <div>
                      <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        Hardware
                      </label>
                      <div style={{ color: 'var(--text-primary)', fontWeight: '500' }}>
                        {String(service.attributes.hardware)}
                      </div>
                    </div>
                  )}
                  
                  {service.attributes.os && (
                    <div>
                      <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        Operating System
                      </label>
                      <div style={{ color: 'var(--text-primary)', fontWeight: '500' }}>
                        {String(service.attributes.os)}
                      </div>
                    </div>
                  )}
                  
                  {shouldRenderAttribute(service.attributes.type) && (
                    <div>
                      <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        Type
                      </label>
                      <div style={{ color: 'var(--text-primary)', fontWeight: '500' }}>
                        {renderAttributeValue(service.attributes.type)}
                      </div>
                    </div>
                  )}
                  
                  {shouldRenderAttribute(service.attributes.class) && (
                    <div>
                      <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        Class
                      </label>
                      <div style={{ color: 'var(--text-primary)', fontWeight: '500' }}>
                        {renderAttributeValue(service.attributes.class)}
                      </div>
                    </div>
                  )}
                  
                  {shouldRenderAttribute(service.attributes.maxIOPerSec) && (
                    <div>
                      <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        Max I/O per Second
                      </label>
                      <div style={{ color: 'var(--text-primary)', fontWeight: '500' }}>
                        {typeof service.attributes.maxIOPerSec === 'number' ? service.attributes.maxIOPerSec.toLocaleString() : renderAttributeValue(service.attributes.maxIOPerSec)}
                      </div>
                    </div>
                  )}
                  
                  {shouldRenderAttribute(service.attributes.maxTroughInMB) && (
                    <div>
                      <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        Max Throughput
                      </label>
                      <div style={{ color: 'var(--text-primary)', fontWeight: '500' }}>
                        {renderAttributeValue(service.attributes.maxTroughInMB)} MB/s
                      </div>
                    </div>
                  )}
                  
                  {service.attributes.metro !== null && (
                    <div>
                      <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        Metro
                      </label>
                      <div style={{ color: 'var(--text-primary)', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <i className={`fas ${service.attributes.metro ? 'fa-check' : 'fa-times'}`} 
                           style={{ color: service.attributes.metro ? 'var(--success-color)' : 'var(--error-color)' }}></i>
                        {service.attributes.metro ? 'Yes' : 'No'}
                      </div>
                    </div>
                  )}
                </div>
                
                {service.attributes?.cfUniqueIds && service.attributes.cfUniqueIds.length > 0 && (
                  <div style={{ marginTop: '1rem' }}>
                    <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      CF Unique IDs
                    </label>
                    <div style={{ 
                      display: 'flex', 
                      flexWrap: 'wrap', 
                      gap: '0.5rem', 
                      marginTop: '0.5rem' 
                    }}>
                      {service.attributes.cfUniqueIds.map((id, index) => (
                        <span
                          key={index}
                          style={{
                            background: 'rgba(79, 172, 254, 0.1)',
                            color: 'var(--accent-color)',
                            padding: '0.25rem 0.5rem',
                            borderRadius: 'var(--radius-sm)',
                            fontSize: '0.8rem',
                            fontFamily: "'JetBrains Mono', 'Courier New', monospace"
                          }}
                        >
                          {id}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Additional Information */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                padding: '1.5rem',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border-color)',
                gridColumn: 'span 2'
              }}
            >
              <h3
                style={{
                  fontSize: '1.1rem',
                  fontWeight: '600',
                  color: 'var(--text-primary)',
                  marginBottom: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                <i className="fas fa-file-alt"></i>
                Additional Information
              </h3>
              
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                  gap: '1rem'
                }}
              >
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    General Product Group
                  </label>
                  <div style={{ color: 'var(--text-primary)', fontWeight: '500' }}>
                    {service.generalProductGroup || 'N/A'}
                  </div>
                </div>
                
                {shouldRenderAttribute(service.attributes?.technicalProductGroup) && (
                  <div>
                    <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Technical Product Group
                    </label>
                    <div style={{ color: 'var(--text-primary)', fontWeight: '500' }}>
                      {renderAttributeValue(service.attributes?.technicalProductGroup)}
                    </div>
                  </div>
                )}
                
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Service ID
                  </label>
                  <div
                    style={{
                      color: 'var(--text-primary)',
                      fontWeight: '500',
                      fontFamily: "'JetBrains Mono', 'Courier New', monospace",
                      fontSize: '0.9rem'
                    }}
                  >
                    {service.id || 'N/A'}
                  </div>
                </div>
                
                {service.documentation && (
                  <div>
                    <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Documentation
                    </label>
                    <div>
                      <a
                        href={service.documentation}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          color: 'var(--accent-color)',
                          textDecoration: 'none',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          fontWeight: '500'
                        }}
                      >
                        <i className="fas fa-external-link-alt"></i>
                        View Documentation
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ServiceDetailModal;
