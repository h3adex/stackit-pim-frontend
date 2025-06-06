import React from 'react';
import type { HeaderProps } from '../types';
import Input from './ui/Input';
import Select from './ui/Select';
import styles from './Header.module.css';

const Header: React.FC<HeaderProps> = ({
  globalSearch,
  onSearchChange,
  entriesPerPage,
  onEntriesPerPageChange
}) => {
  const entriesOptions = [
    { value: '25', label: '25' },
    { value: '50', label: '50' },
    { value: '100', label: '100' },
    { value: '200', label: '200' },
    { value: '500', label: '500' }
  ];

  const handleEntriesChange = (value: string) => {
    onEntriesPerPageChange(parseInt(value));
  };

  return (
    <header className={styles.header}>
      <div className={styles.headerContent}>
        {/* Logo Section */}
        <div className={styles.logoSection}>
          <div className={styles.logoIcon}>
            <i className="fas fa-book" aria-label="logo"></i>
          </div>
          <div className={styles.titleSection}>
            <h1>
              STACKIT PIM
            </h1>
            <span className={styles.subtitle}>
              Product Service Catalog
            </span>
          </div>
        </div>

        {/* Header Controls */}
        <div className={styles.headerControls}>
          {/* Entries Per Page Control */}
          <div className={styles.controlGroup}>
            <label>
              <i className="fas fa-list" aria-label="Entries"></i>
              <div style={{ minWidth: '100px' }}>
                <Select
                  options={entriesOptions}
                  value={entriesPerPage.toString()}
                  onChange={handleEntriesChange}
                  placeholder="Entries"
                />
              </div>
            </label>
          </div>

          {/* Search Control */}
          <div className={styles.searchGroup} style={{ minWidth: '350px' }}>
            <Input
              value={globalSearch}
              onChange={onSearchChange}
              placeholder="Search across all fields..."
              leftIcon={<i className="fas fa-search" aria-label="Search"></i>}
              showClearButton={true}
              type="search"
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
