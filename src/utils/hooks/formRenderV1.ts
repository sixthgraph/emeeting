const eddata: any = []

const checkIndex = (elemId: any, data: any) => {
  return data.findIndex((x: any) => x._id === elemId)
}

export const getEdata = (workData: any) => {
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
  }

  return workData
}

export const formRender = (dataObj: string) => {
  let i: any
  const elem: any = dataObj

  for (i in elem) {
    $('#fb-render-' + elem[i]._id).formRender({
      dataType: 'json',
      formData: elem[i].form_template
    })

    $('input', '#fb-render-' + elem[i]._id).on('change', function () {
      const v = $(this).val()
      const id = $(this).attr('id')
      const parentId = $(this).parents('div.rendered-form').parent().attr('id')
      const parentIdArr: any = parentId?.split('-')

      const check: any = eddata.filter((obj: { eid: any; id: string | undefined }) => {
        if (obj.id == id && obj.eid == parentIdArr[2]) {
          // sg bug here
          return true
        }
      })

      console.log('check.length')
      console.log(check.length)

      if (check.length == 0) {
        const newData = {
          id: id,
          value: v,
          eid: parentIdArr[2]
        }

        eddata.push(newData)
      } else {
        eddata.filter((obj: { value: any; eid: any; id: string | undefined }) => {
          if (obj.id == id && obj.eid == parentIdArr[2]) {
            obj.value = v
          }
        })
      }

      console.log('eddata ===')
      console.log(eddata)
    })
  }
}
