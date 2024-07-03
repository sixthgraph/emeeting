import { getServerSession } from 'next-auth'
import axios from 'axios'
import { options } from '@/app/api/auth/[...nextauth]/options'
import DepartmentList from '@/views/apps/department/list'

const getData = async () => {
  const session = await getServerSession(options)

  try {
    const token = { token: session?.user.token }

    const headers = {
      Authorization: `Bearer ${token}`,
      'Cache-Control': 'no-cache',
      Pragma: 'no-cache',
      Expires: '0'
    }

    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/departments/list`, token, { headers })

    if (response.data.message === 'success') {
      return response.data
    } else {
      return 'Department not found'
    }
  } catch (err) {
    console.log(err)
  }
}

const DepartmentListApp = async () => {
  // Vars
  const data = await getData()
  const departmentData = data.data.detail
  const stateinfoData = data.data.stateinfos
  const depParentData = data.data.depPartents

  return <DepartmentList departmentData={departmentData} stateinfoData={stateinfoData} depParentData={depParentData} />
}

export default DepartmentListApp
