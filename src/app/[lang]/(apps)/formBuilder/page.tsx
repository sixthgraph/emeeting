'use client'
import { useEffect } from 'react'

import Script from 'next/script'

import $ from 'jquery'

//require('@/components/test-render')

export default function FormBuilderPage() {
  useEffect(() => {
    console.log($('#fb-editor').html())
  })

  return (
    <>
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
        src='https://rd.excelink.co.th/saraban.dev/assets/vendor_components/form-builder/2022/form-builder.min.js'
        onLoad={() => {
          console.log('Script has loaded form-builder.min.js')
        }}
      />
      <Script
        src='https://rd.excelink.co.th/saraban.dev/assets/vendor_components/form-builder/2022/form-render.min.js'
        onLoad={() => {
          console.log('Script has loaded form-render.min.js')
        }}
      />
      <Script
        src='/script/test.js'
        strategy='afterInteractive'
        onLoad={() => {
          console.log('Script has loaded')
        }}
      />

      <div id='fb-editor'>FormBuilder example</div>
      <Script id='show-banner' strategy='afterInteractive'>
        {`alert("test inline")`}
      </Script>
    </>
  )
}
