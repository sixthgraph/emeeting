// Do not remove this following 'use client' else SubMenu rendered in vertical menu on smaller screen will not work.
'use client'

// MUI Imports
import { useParams } from 'next/navigation'

import { useTheme } from '@mui/material/styles'

// Type Imports
import type { VerticalMenuContextProps } from '@menu/components/vertical-menu/Menu'
import type { getDictionary } from '@/utils/getDictionary'

// Component Imports
import HorizontalNav, { Menu, MenuItem, SubMenu } from '@menu/horizontal-menu'
import VerticalNavContent from './VerticalNavContent'

// Hook Imports
import useVerticalNav from '@menu/hooks/useVerticalNav'
import { useSettings } from '@core/hooks/useSettings'

// Styled Component Imports
import StyledHorizontalNavExpandIcon from '@menu/styles/horizontal/StyledHorizontalNavExpandIcon'
import StyledVerticalNavExpandIcon from '@menu/styles/vertical/StyledVerticalNavExpandIcon'

// Style Imports
import menuItemStyles from '@core/styles/horizontal/menuItemStyles'
import menuRootStyles from '@core/styles/horizontal/menuRootStyles'
import verticalNavigationCustomStyles from '@core/styles/vertical/navigationCustomStyles'
import verticalMenuItemStyles from '@core/styles/vertical/menuItemStyles'
import verticalMenuSectionStyles from '@core/styles/vertical/menuSectionStyles'

type RenderExpandIconProps = {
  level?: number
}

type RenderVerticalExpandIconProps = {
  open?: boolean
  transitionDuration?: VerticalMenuContextProps['transitionDuration']
}

const RenderExpandIcon = ({ level }: RenderExpandIconProps) => (
  <StyledHorizontalNavExpandIcon level={level}>
    <i className='tabler-chevron-right' />
  </StyledHorizontalNavExpandIcon>
)

const RenderVerticalExpandIcon = ({ open, transitionDuration }: RenderVerticalExpandIconProps) => (
  <StyledVerticalNavExpandIcon open={open} transitionDuration={transitionDuration}>
    <i className='tabler-chevron-right' />
  </StyledVerticalNavExpandIcon>
)

const HorizontalMenu = ({ dictionary }: { dictionary: Awaited<ReturnType<typeof getDictionary>> }) => {
  // Hooks
  const verticalNavOptions = useVerticalNav()
  const theme = useTheme()
  const params = useParams()
  const { settings } = useSettings()

  // Vars
  const { skin } = settings
  const { transitionDuration } = verticalNavOptions
  const { lang: locale } = params

  return (
    <HorizontalNav
      switchToVertical
      verticalNavContent={VerticalNavContent}
      verticalNavProps={{
        customStyles: verticalNavigationCustomStyles(verticalNavOptions, theme),
        backgroundColor:
          skin === 'bordered' ? 'var(--mui-palette-background-paper)' : 'var(--mui-palette-background-default)'
      }}
    >
      <Menu
        rootStyles={menuRootStyles(theme)}
        renderExpandIcon={({ level }) => <RenderExpandIcon level={level} />}
        menuItemStyles={menuItemStyles(settings, theme)}
        renderExpandedMenuItemIcon={{ icon: <i className='tabler-circle text-xs' /> }}
        popoutMenuOffset={{
          mainAxis: ({ level }) => (level && level > 0 ? 14 : 12),
          alignmentAxis: 0
        }}
        verticalMenuProps={{
          menuItemStyles: verticalMenuItemStyles(verticalNavOptions, theme, settings),
          renderExpandIcon: ({ open }) => (
            <RenderVerticalExpandIcon open={open} transitionDuration={transitionDuration} />
          ),
          renderExpandedMenuItemIcon: { icon: <i className='tabler-circle text-xs' /> },
          menuSectionStyles: verticalMenuSectionStyles(verticalNavOptions, theme)
        }}
      >
        <MenuItem href={`/${locale}/dashboard`} icon={<i className='tabler-dashboard' />}>
          {dictionary['navigation'].dashboard}
        </MenuItem>
        <MenuItem href={`/${locale}/todo`} icon={<i className='tabler-inbox' />}>
          {dictionary['navigation'].todo}
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
        <MenuItem href={`/${locale}/my-requests`} icon={<i className='tabler-box' />}>
          {dictionary['navigation'].myRequests}
        </MenuItem>
        <MenuItem href={`/${locale}/comments`} icon={<i className='tabler-box' />}>
          {dictionary['navigation'].comments}
        </MenuItem>
        <SubMenu label={dictionary['navigation'].admin} icon={<i className='tabler-settings' />}>
          <MenuItem href={`/${locale}/users`} icon={<i className='tabler-user' />}>
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
        </SubMenu>
      </Menu>
    </HorizontalNav>
  )
}

export default HorizontalMenu
