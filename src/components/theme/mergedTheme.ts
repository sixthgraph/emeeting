import { Poppins } from 'next/font/google'

import { MuiAccordionSummary } from '@mui/material/AccordionSummary'

/*
 * We recommend using the merged theme if you want to override our core theme.
 * This means you can use our core theme and override it with your own customizations.
 * Write your overrides in the userTheme object in this file.
 * The userTheme object is merged with the coreTheme object within this file.
 * Export this file and import it in the `@components/theme/index.tsx` file to use the merged theme.
 */

// Next Imports

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900']
})

// MUI Imports
import { deepmerge } from '@mui/utils'
import type { Theme } from '@mui/material/styles'

// Type Imports
import type { Settings } from '@core/contexts/settingsContext'
import type { SystemMode } from '@core/types'

// Core Theme Imports
import coreTheme from '@core/theme'

const mergedTheme = (settings: Settings, mode: SystemMode, direction: Theme['direction']) => {
  // Vars
  const userTheme = {
    // Write your overrides here.
    components: {
      MuiTab: {
        styleOverrides: {
          root: {
            // Some CSS
            color: '#a1a5b7'
          }
        }
      }

      // MuiButton: {
      //   styleOverrides: {
      //     root: {
      //       textTransform: 'uppercase'
      //     }
      //   }
      // }
    },
    typography: {
      fontFamily: poppins.style.fontFamily

      // h1: {
      //   fontWeight: 700,
      //   fontSize: '3.5rem',
      //   lineHeight: 1.375
      // }
    }
  } as Theme

  return deepmerge(coreTheme(settings, mode, direction), userTheme)
}

export default mergedTheme
