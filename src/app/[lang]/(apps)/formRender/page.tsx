'use client'

import Script from 'next/script'

export default function FormRenderPage() {
  return (
    <>
      <div className='fb-render'></div>
      <Script
        src='https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js'
        onLoad={() => {
          console.log('Script has loaded jquery.min.js')
        }}
      />
      <Script
        src='https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.13.2/jquery-ui.min.js'
        onLoad={() => {
          console.log('Script has loaded jquery-ui.min.js')
        }}
      />
      <Script
        async
        strategy='afterInteractive'
        src={`${process.env.BASEPATH}/assets/form-builder/2022/form-builder.min.js`}
      />
      <Script
        async
        strategy='afterInteractive'
        src={`${process.env.BASEPATH}/assets/form-builder/2022/form-render.min.js`}
      />

      <Script
        src='/script/test-render.js'
        strategy='afterInteractive'
        onLoad={() => {
          console.log('form render has loaded')
        }}
      />
    </>
  )
}
