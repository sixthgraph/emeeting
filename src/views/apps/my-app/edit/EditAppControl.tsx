'use client'

import Script from 'next/script'

import { Card, CardContent, CardHeader } from '@mui/material'

import { routeRender } from '@/utils/hooks/routeRender'

import '@/css/jquery-ui.css'
import '@/css/jquery-ui.theme.css'
import '@/css/jsplumb.css'
import '@/css/edit_route.css'

const EditAppControl = (appData: any) => {
  const basepath = process.env.NEXT_PUBLIC_BASEPATH
  const workFlowData = appData?.appData.data
  const routeName = workFlowData[0].name

  return (
    <Card>
      <CardHeader title={routeName} />
      <CardContent id='design-route'>
        <div
          id='routeContainer'
          className='routeContainer'
          style={{ width: '100%', minHeight: '500px', display: 'block' }}
        >
          <div
            className='startpoint node w process popover'
            style={{ left: '560px', top: '10px', display: 'block' }}
            data-nodetype='startpoint'
            id='startpoint'
          >
            <h3 className='popover-title popover-title3'>
              <button className='pull-right btn btn-rounded btn-xs btn-setting btn-default m-r-xs' type='button'>
                <i className='fa fa-cog btn-setting'></i>
              </button>
              <div className='ep pull-right'></div>
              <div
                style={{ whiteSpace: 'nowrap', marginRight: '80px', textOverflow: 'ellipsis', overflow: 'hidden' }}
                className='name-pro'
              >
                Start
              </div>
            </h3>
            <div className='popover-content'>
              <div className='scrollable process-desc'>Start Process...</div>
            </div>
          </div>
        </div>
      </CardContent>
      <Script
        src={`${basepath}/script/test-render.js`}
        strategy='lazyOnload'
        onReady={() => {
          routeRender(workFlowData)
        }}
      />
    </Card>
  )
}

export default EditAppControl
