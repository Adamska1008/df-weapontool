# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview
This is a Vue 3 + TypeScript + Vite project for a weapon TTK (Time to Kill) calculation tool. The application allows users to configure weapons, target armor settings, and visualize TTK statistics through an interactive chart. The project is deployed to GitHub Pages.

## Development Commands
- `npm run dev` - Start development server
- `npm run build` - Build for production (runs vue-tsc then vite build)
- `npm run preview` - Preview production build
- `npm run test` - Run tests with Vitest
- `npm run test:ui` - Run tests with Vitest UI
- `just dev` - Alternative command to start dev server (via justfile)
- `just build` - Alternative command to build (via justfile)

## Project Architecture

### State Management
- **Pinia Stores**: Two main stores manage application state
  - `weaponStore` (`src/stores/weapon.ts`): Handles weapon data and lookups with caching optimization
  - `accessoryStore` (`src/stores/accessory.ts`): Manages accessory data and filtering

### Core Components
- **App.vue**: Monolithic component handling UI, state management, and TTK calculations (423 lines)
- **TTK Calculations**: Complex calculation logic in `src/utils/ttk.ts` for damage reduction, distance decay, and bullets-to-kill
- **Data Models**: External JSON files (`src/data/weapons.json`, `src/data/accessories.json`) drive the application

### Key Architecture Patterns
1. **Single-Page Application**: All functionality contained in App.vue with reactive state management
2. **Data-Driven Design**: Weapon and accessory data stored externally, loaded via TypeScript interfaces
3. **Real-time Calculations**: TTK values computed dynamically as users change configurations
4. **Chart Integration**: ECharts for visualizing TTK across distances (0-100m)

## Data Model Details

### Weapon Interface
- Properties: damage, armorDamage, fireSpeed, ranges, decays, availableAccessories
- Special features: bulletLevels array, meatAmmoAllowed flag
- Range system: Uses distance-based decay with ranges array and corresponding decays multipliers

### Accessory System
- Types: barrel, muzzle, gasComp (note: variable naming inconsistency in App.vue)
- Effects: distance multipliers, damage bonuses, fireSpeed modifications
- Filtering: Accessories filtered by weapon's availableAccessories array

### TTK Calculation Logic
- Formula: `(60 / RPM) * (ShotsToKill - 1) * 1000 ms`
- Factors: bullet level vs armor level, distance decay, accessory bonuses, meat ammo special case
- Complex calculations: Recursive bullets-to-kill with armor penetration mechanics

## Performance Considerations
- **Heavy Computations**: TTK calculations run for 100 distances per weapon, recalculated on any change
- **Memory Management**: weaponIdMap in weaponStore provides lookup optimization
- **Rendering**: Large computed property for chart data can cause performance issues
- **TODO**: Consider memoization, web workers, or virtualized calculations for optimization

## Development Environment
- **Base Path**: Configured for GitHub Pages deployment (`/df-weapontool/`)
- **Build Process**: TypeScript compilation followed by Vite build
- **Testing**: Vitest with UI support available
- **Node Version**: 20 (specified in GitHub Actions)