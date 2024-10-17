import Grid from '@mui/material/Grid'

// Type Imports
import SearchWorkListTable from './searchWorkListTable'

// import type { DepType } from '@/types/apps/userTypes'

const SearchWorkList = ({ keywordData, searchData }: { keywordData?: any; searchData?: any }) => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <SearchWorkListTable keywordData={keywordData} tableData={searchData} />
      </Grid>
    </Grid>
  )
}

export default SearchWorkList
