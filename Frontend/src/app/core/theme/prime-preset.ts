// -----------------------------------------------------------------------------
// EnterpriseManagement Design System — PrimeNG Aura Semantic Preset Alignment
// -----------------------------------------------------------------------------

import { definePreset } from '@primeuix/themes';
import Aura from '@primeuix/themes/aura';

/**
 * EnterprisePreset
 *
 * Formally aligns PrimeNG's Aura preset design tokens with the EnterpriseManagement
 * design system, ensuring unified palette, surface, text, and border tokens
 * across both Light and Dark color schemes.
 *
 * Note on Token Relationship:
 * `definePreset` sets PrimeNG's internal semantic tokens (e.g. `{blue.600}`, `{slate.*}`),
 * which generate PrimeNG's `--p-*` CSS variables. It does NOT create direct runtime CSS
 * aliases to `--em-*` (e.g. `--p-primary-color: var(--em-color-primary)`).
 * Runtime synchronization is maintained via shared design tokens and selector alignment.
 */
export const EnterprisePreset = definePreset(Aura, {
  semantic: {
    primary: {
      50: '{blue.50}',
      100: '{blue.100}',
      200: '{blue.200}',
      300: '{blue.300}',
      400: '{blue.400}',
      500: '{blue.500}',
      600: '{blue.600}',
      700: '{blue.700}',
      800: '{blue.800}',
      900: '{blue.900}',
      950: '{blue.950}',
    },
    colorScheme: {
      light: {
        surface: {
          0: '#ffffff',
          50: '{slate.50}',
          100: '{slate.100}',
          200: '{slate.200}',
          300: '{slate.300}',
          400: '{slate.400}',
          500: '{slate.500}',
          600: '{slate.600}',
          700: '{slate.700}',
          800: '{slate.800}',
          900: '{slate.900}',
          950: '{slate.950}',
        },
        primary: {
          color: '{blue.600}',
          contrastColor: '#ffffff',
          hoverColor: '{blue.700}',
          activeColor: '{blue.800}',
        },
        text: {
          color: '{slate.900}',
          hoverColor: '{slate.950}',
          mutedColor: '{slate.500}',
          hoverMutedColor: '{slate.600}',
        },
        content: {
          background: '#ffffff',
          hoverBackground: '{slate.100}',
          borderColor: '{slate.200}',
          color: '{slate.900}',
          hoverColor: '{slate.950}',
        },
      },
      dark: {
        surface: {
          0: '#ffffff',
          50: '{slate.950}',
          100: '{slate.900}',
          200: '{slate.800}',
          300: '{slate.700}',
          400: '{slate.600}',
          500: '{slate.500}',
          600: '{slate.400}',
          700: '{slate.300}',
          800: '{slate.200}',
          900: '{slate.100}',
          950: '{slate.50}',
        },
        primary: {
          color: '{blue.500}',
          contrastColor: '#0f172a',
          hoverColor: '{blue.400}',
          activeColor: '{blue.600}',
        },
        text: {
          color: '{slate.50}',
          hoverColor: '#ffffff',
          mutedColor: '{slate.400}',
          hoverMutedColor: '{slate.300}',
        },
        content: {
          background: '{slate.800}',
          hoverBackground: '{slate.700}',
          borderColor: '{slate.700}',
          color: '{slate.50}',
          hoverColor: '#ffffff',
        },
      },
    },
  },
});
