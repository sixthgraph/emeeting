'use client'

// MUI Imports
import { useParams } from 'next/navigation'

import { useTheme } from '@mui/material/styles'

// Third-party Imports
import PerfectScrollbar from 'react-perfect-scrollbar'

// Type Imports
import { useSession } from 'next-auth/react'

import type { getDictionary } from '@/utils/getDictionary'
import type { VerticalMenuContextProps } from '@menu/components/vertical-menu/Menu'

// Component Imports
import { Menu, MenuItem, MenuSection } from '@menu/vertical-menu'

// Hook Imports
import { useSettings } from '@core/hooks/useSettings'
import useVerticalNav from '@menu/hooks/useVerticalNav'

// Styled Component Imports
import StyledVerticalNavExpandIcon from '@menu/styles/vertical/StyledVerticalNavExpandIcon'

// Style Imports
import menuItemStyles from '@core/styles/vertical/menuItemStyles'
import menuSectionStyles from '@core/styles/vertical/menuSectionStyles'

type RenderExpandIconProps = {
  open?: boolean
  transitionDuration?: VerticalMenuContextProps['transitionDuration']
}

type Props = {
  dictionary: Awaited<ReturnType<typeof getDictionary>>
  scrollMenu: (container: any, isPerfectScrollbar: boolean) => void
}

const RenderExpandIcon = ({ open, transitionDuration }: RenderExpandIconProps) => (
  <StyledVerticalNavExpandIcon open={open} transitionDuration={transitionDuration}>
    <i className='tabler-chevron-right' />
  </StyledVerticalNavExpandIcon>
)

const VerticalMenu = ({ dictionary, scrollMenu }: Props) => {
  // Hooks

  const theme = useTheme()
  const verticalNavOptions = useVerticalNav()
  const { settings } = useSettings()
  const params = useParams()
  const { isBreakpointReached } = useVerticalNav()
  const { data: session } = useSession()
  const userRole = session?.user.role

  // Vars
  const { transitionDuration } = verticalNavOptions
  const { lang: locale } = params

  const ScrollWrapper = isBreakpointReached ? 'div' : PerfectScrollbar

  return (
    // eslint-disable-next-line lines-around-comment
    /* Custom scrollbar instead of browser scroll, remove if you want browser scroll only */
    <ScrollWrapper
      {...(isBreakpointReached
        ? {
            className: 'bs-full overflow-y-auto overflow-x-hidden',
            onScroll: container => scrollMenu(container, false)
          }
        : {
            options: { wheelPropagation: false, suppressScrollX: true },
            onScrollY: container => scrollMenu(container, true)
          })}
    >
      {/* Incase you also want to scroll NavHeader to scroll with Vertical Menu, remove NavHeader from above and paste it below this comment */}
      {/* Vertical Menu */}
      <Menu
        popoutMenuOffset={{ mainAxis: 23 }}
        menuItemStyles={menuItemStyles(verticalNavOptions, theme, settings)}
        renderExpandIcon={({ open }) => <RenderExpandIcon open={open} transitionDuration={transitionDuration} />}
        renderExpandedMenuItemIcon={{ icon: <i className='tabler-circle text-xs' /> }}
        menuSectionStyles={menuSectionStyles(verticalNavOptions, theme)}
      >
        {/* <MenuItem href={`/${locale}/dashboard`} icon={<i className='tabler-dashboard' />}>
          {dictionary['navigation'].dashboard}
        </MenuItem> */}
        <MenuSection label='Works'>
          <MenuItem href={`/${locale}/todo`} icon={<i className='tabler-inbox' />}>
            {dictionary['navigation'].todo}
          </MenuItem>
          <MenuItem href={`/${locale}/my-requests`} icon={<i className='tabler-inbox' />}>
            {dictionary['navigation'].myRequest}
          </MenuItem>
          <MenuItem href={`/${locale}/comments`} icon={<i className='tabler-inbox' />}>
            {dictionary['navigation'].comments}
          </MenuItem>
          {/* <MenuItem href={`/${locale}/my-items`} icon={<i className='tabler-box' />}>
            {dictionary['navigation'].myItems}
          </MenuItem>
          <MenuItem href={`/${locale}/assignment`} icon={<i className='tabler-window-maximize' />}>
            {dictionary['navigation'].assignment}
          </MenuItem>
          <MenuItem href={`/${locale}/collabs`} icon={<i className='tabler-brand-asana' />}>
            {dictionary['navigation'].collabs}
          </MenuItem> */}
        </MenuSection>
        <MenuSection label={dictionary['navigation'].create}>
          <MenuItem href={`/${locale}/new-request`}>{dictionary['navigation'].newRequest}</MenuItem>
          <MenuItem href={`/${locale}/new-route`}>{dictionary['navigation'].newRoute}</MenuItem>
        </MenuSection>
        {userRole == 1 && (
          <MenuSection label={dictionary['navigation'].admin}>
            <MenuItem href={`/${locale}/users/list`} icon={<i className='tabler-user' />}>
              {dictionary['navigation'].users}
            </MenuItem>
            {/* <MenuItem href={`/${locale}/users-example`} icon={<i className='tabler-user' />}>
              Users Example
            </MenuItem> */}
            <MenuItem href={`/${locale}/departments`} icon={<i className='tabler-building-bank' />}>
              {dictionary['navigation'].departments}
            </MenuItem>
            <MenuItem href={`/${locale}/groups`} icon={<i className='tabler-users' />}>
              {dictionary['navigation'].userGroup}
            </MenuItem>
            <MenuItem href={`/${locale}/position`} icon={<i className='tabler-shield' />}>
              {dictionary['navigation'].position}
            </MenuItem>
            <MenuItem href={`/${locale}/stateinfo`} icon={<i className='tabler-sort-descending-2' />}>
              {dictionary['navigation'].stateInfo}
            </MenuItem>
          </MenuSection>
        )}
      </Menu>
    </ScrollWrapper>
  )
}

export default VerticalMenu
