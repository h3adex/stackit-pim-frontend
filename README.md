# STACKIT Service Catalog

STACKIT Service Catalog is a modern, high-performance web application for browsing, filtering, and exporting a comprehensive catalog of cloud services and products. Built with React, TypeScript, and Vite, STACKIT Service Catalog provides a powerful and user-friendly interface to explore detailed product data, compare offerings, and export selections for further analysis.

## Features

- **Global Search:** Instantly search across all services and products.
- **Advanced Filtering:** Filter by product, category, region, maturity, CPU count, RAM size, and more.
- **Sortable Data Table:** Sort by any column, including price and technical attributes.
- **Pagination:** Efficiently browse large datasets with adjustable entries per page.
- **CSV Export:** Export the current filtered and sorted view to CSV for offline analysis.
- **Responsive UI:** Clean, modern design with animated backgrounds and modular components.
- **Error & Loading States:** Robust handling of data loading and error scenarios.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or newer recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js)

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```
   The app will be available at [http://localhost:5173](http://localhost:5173) by default.

3. **Build for production:**
   ```bash
   npm run build
   ```

4. **Preview the production build:**
   ```bash
   npm run preview
   ```

### Linting

To check code quality and formatting:
```bash
npm run lint
```

## Data Model

The application loads its data from `public/products.json`, which contains an array of service objects. Each service has fields such as:

- `title`: Human-readable name of the service/product
- `id`, `sku`: Unique identifiers
- `product`: Product family or type
- `category`: Service category (e.g., Compute, Storage, Database)
- `region`: Deployment region
- `maturityModelState`: Maturity level (e.g., beta, ga)
- `price`, `monthlyPrice`: Pricing information (string, in €)
- `attributes`: Nested object with technical details (e.g., `vCPU`, `ram`)
- `unit`, `unitBilling`, `currency`, `generalProductGroup`, etc.

**Note:** The data model is extensible and may include additional fields depending on the product.

## Usage

- **Search:** Use the search bar to find services by any keyword.
- **Filter:** Use the filter panel to narrow down results by product, category, region, maturity, CPU, or RAM.
- **Sort:** Click on table headers to sort by any column.
- **Pagination:** Adjust entries per page and navigate between pages.
- **Export:** Click the "Export CSV" button to download the current view as a CSV file.

## Project Structure

```
stackit/
  public/
    products.json         # Product/service data source
    favicon-16x16.png
  src/
    components/           # UI components (DataTable, FilterPanel, etc.)
    assets/               # Static assets (e.g., icons)
    types/                # TypeScript type definitions
    App.tsx               # Main application logic
    style files           # CSS/Module CSS for styling
  package.json            # Project metadata and scripts
  vite.config.ts          # Vite configuration
  tsconfig*.json          # TypeScript configuration
```

## License

This project is private and proprietary. All rights reserved.
