# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview
This is a Vue 3 + TypeScript + Vite project for a weapon TTK (Time to Kill) calculation tool. The application allows users to configure weapons, target armor settings, and visualize TTK statistics.

## Project Structure
- `src/App.vue` - Main application component with UI for weapon selection and configuration
- `src/main.ts` - Application entry point
- `src/stores/weapon.ts` - Pinia store for weapon data management
- `src/utils/ttk.ts` - Utility functions for TTK calculations
- `src/assets/` - Static assets

## Development Commands
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Code Architecture
1. **State Management**: Uses Pinia for state management, with a weapon store that contains weapon data and lookup functions.
2. **Component Structure**: Single-page application with App.vue as the main component handling weapon selection, configuration, and TTK visualization.
3. **Data Model**: 
   - Weapon interface with properties like damage, fire rate, range decay values
   - WeaponSetting interface for user-configured weapons with bullet level
4. **TTK Calculation**: Framework exists but implementation is incomplete in the utils/ttk.ts file.

## Key Components
- Weapon selection and configuration UI
- Target armor configuration
- Planned TTK visualization (not yet implemented)