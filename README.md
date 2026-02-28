# OpenMRS Dependency Vulnerability Dashboard

An interactive dashboard for visualizing and analyzing dependency vulnerabilities across various OpenMRS modules. This tool processes raw security reports and provides a clear, categorized view of security risks.

## Features

- **Multi-Repository Support**: Processes and displays reports from multiple repositories (e.g., `openmrs-core`, `idgen`, `billing`).
- **Risk Categorization**: Automatically categorizes vulnerabilities by severity (Critical, High, Medium, Low).
- **Interactive Data Tables**: Expandable tables showing detailed CVE information, including:
  - Severity Tags
  - CVSS Scores
  - CWE Identifiers
  - Affected vs. Fixed Versions
  - Direct links to vulnerability details (NVD/GitHub Advisories).
- **Intelligent Data Processing**: Extracts fix versions and exploitability information from report descriptions and links.

## Getting Started

### Prerequisites

- Node.js (Latest LTS recommended)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   cd dashboard
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Build for production:
   ```bash
   npm run build
   ```

## Project Structure

- `dashboard/src/components/`: Reusable React components (`VulnerabilityTable`, `DependencyDataTable`, etc.).
- `dashboard/src/data/`: Location for raw JSON security reports.
- `dashboard/src/dataProcessor.ts`: Core logic for transforming raw data into the UI model.
- `dashboard/src/types.ts`: Shared TypeScript interfaces and types.
