// import * as FriendCard from './../pages/FriendCard';

// import * as formRender from 'https://rd.excelink.co.th/saraban.dev/assets/vendor_components/form-builder/2022/form-render.min.js'

const eddata: any = []

const checkIndex = (elemId: any, data: any) => {
  return data.findIndex((x: any) => x._id === elemId)
}

const mergeObj = (a: any, b: any, prop: any) => {
  const reduced = []

  for (let i = 0; i < a.length; i++) {
    const aitem = a[i]
    let found = false

    for (let ii = 0; ii < b.length; ii++) {
      if (aitem[prop] === b[ii][prop]) {
        b[ii]['value'] = aitem['value']
        found = true
        break
      }
    }

    if (!found) {
      reduced.push(aitem)
    }
  }

  return reduced.concat(b)
}

export const getEdata = async (workData: any) => {
  let i: any
  const elem: any = workData

  for (i in elem) {
    const index = checkIndex(elem[i]._id, workData)
    const tempData = []

    for (let idx = 0; idx < eddata.length; idx++) {
      if (eddata[idx].eid === elem[i]._id) {
        tempData.push(eddata[idx])
      }
    }

    if (workData[index].form_data === undefined) {
      workData[index].form_data = []
    }

    workData[index].form_data = tempData
    workData[index].form_template = mergeObj(workData[index].form_data, workData[index].form_template, 'name')
    delete workData[index].form_data
  }

  return workData
}

declare global {
  interface JQuery {
    formRender(data: any): void
  }
}

export const formRenderV1 = (dataObj: string) => {
  let i: any
  const elem: any = dataObj

  for (i in elem) {
    $('#fb-render-' + elem[i]._id).formRender({
      dataType: 'json',
      formData: elem[i].form_template
    })

    $('#fb-render-' + elem[i]._id)
      .find(
        $(
          'input[type="text"],input[type = "number"],input[type = "formulatext"],input[type = "hidden"],input[type = "date"] ,select, button, h1, h2, h3, p, address, output, canvas, blockquote, textarea, .checkbox-group, .radio-group'
        )
      )
      .on('change', function () {
        //$('input', '#fb-render-' + elem[i]._id).on('change', function () {
        const v = $(this).val()
        const id = $(this).attr('id')
        const parentId = $(this).parents('div.rendered-form').parent().attr('id')
        const parentIdArr: any = parentId?.split('-')

        const check: any = eddata.filter((obj: { eid: any; name: string | undefined }) => {
          if (obj.name == id && obj.eid == parentIdArr[2]) {
            return true
          }
        })

        if (check.length == 0) {
          const newData = {
            name: id,
            value: v,
            eid: parentIdArr[2]
          }

          eddata.push(newData)
        } else {
          eddata.filter((obj: { value: any; eid: any; name: string | undefined }) => {
            if (obj.name == id && obj.eid == parentIdArr[2]) {
              obj.value = v
            }
          })
        }
      })
  }
}
