export type PrimaryColorConfig = {
  name?: string
  light?: string
  main: string
  dark?: string
}

// Primary color config object
const primaryColorConfig: PrimaryColorConfig[] = [
  {
    name: 'primary-1',
    light: '#54C1FE',
    main: '#26ACF8',
    dark: '#009BF3'
  },
  {
    name: 'primary-2',
    light: '#7DE8AD',
    main: '#50CC88',
    dark: '#019042'
  },
  {
    name: 'primary-3',
    light: '#FFDF6D',
    main: '#FFC703',
    dark: '#C39700'
  },
  {
    name: 'primary-4',
    light: '#FF7697',
    main: '#F1416C',
    dark: '#B3012C'
  },
  {
    name: 'primary-5',
    light: '#9E70FF',
    main: '#7239EA',
    dark: '#5A0CFF'
  }
]

export default primaryColorConfig
