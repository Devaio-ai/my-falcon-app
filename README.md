# Falcon Dialysis Surveillance Report Generator

A professional web application for generating and managing healthcare surveillance reports based on CDC and NHSN standards.

## Features

- **Surveillance Modules:**
  - VAE (Ventilator-Associated Event)
  - CLABSI (Central Line-Associated Bloodstream Infection)
  - CAUTI (Catheter-Associated Urinary Tract Infection)
  - SSI (Surgical Site Infection)
  - DE (Dialysis Events)

- **Data Management:**
  - Monthly data entry with automatic rate calculations
  - Local storage for data persistence
  - Edit and delete functionality
  - Population-specific tracking (Adults & NICU)

- **Reports and Visualization:**
  - Interactive charts and graphs
  - Monthly and annual reports
  - Benchmark comparisons
  - Export capabilities

- **Professional UI/UX:**
  - Responsive design
  - Modern and clean interface
  - Accessible components
  - Mobile-friendly

## Tech Stack

- React with TypeScript
- Vite for build tooling
- TailwindCSS for styling
- Recharts for data visualization
- LocalForage for data persistence
- React Router for navigation

## Getting Started

1. **Clone the repository:**
   ```bash
   git clone [repository-url]
   cd falcon-dialysis-surveillance
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Build for production:**
   ```bash
   npm run build
   ```

## Usage

1. **Data Entry:**
   - Navigate to the Data Entry page
   - Select the surveillance module
   - Enter numerator and denominator values
   - Save the entry

2. **Reports:**
   - Go to the Reports page
   - Select module, population, and year
   - View interactive charts and tables
   - Export data as needed

3. **Settings:**
   - Configure benchmark rates
   - Set up custom preferences
   - Manage data sources

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- CDC/NHSN for surveillance standards
- Healthcare professionals for feedback and testing
- Open source community for tools and libraries
