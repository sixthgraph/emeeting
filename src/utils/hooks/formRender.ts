// import * as FriendCard from './../pages/FriendCard';

// import * as formRender from 'https://rd.excelink.co.th/saraban.dev/assets/vendor_components/form-builder/2022/form-render.min.js'
declare global {
  interface JQuery {
    formRender(data: any): void
  }
  interface JQuery {
    datetimepicker(data: any): void
  }
  interface datetimepicker {
    setLocale(data: any): void
  }

  // interface datetimepicker {

  //   setLocale(data: any): void

  // }
}

const updateData: any = []

const checkIndex = (elemId: any, data: any) => {
  return data.findIndex((x: any) => x._id === elemId)
}

const mergeObj = (a: any, b: any, prop: any) => {
  const reduced = []

  // console.log('start mergObj')
  // console.log('form_data')
  // console.log(a) //form_data
  // console.log('form_template')
  // console.log(b) //form_template

  for (let i = 0; i < a.length; i++) {
    const aitem = a[i]
    let found = false

    if (aitem.fieldType === 'checkbox-group') {
      const nameStr = aitem.name
      const name = nameStr.replace('[]', '')
      const aitemValue = aitem.value
      const item = b.find((elem: any) => elem.name === name)

      item.value = aitemValue.toString() //sg test here

      const itemValues = item.values

      for (let ii = 0; ii < aitemValue.length; ii++) {
        const itemFound = itemValues.find((itemElem: any) => itemElem.value === aitemValue[ii])

        if (itemFound) {
          itemFound.selected = true
        }
      }
    } // if checkbox-group

    if (aitem.fieldType === 'radio-group') {
      const nameStr = aitem.name
      const name = nameStr.replace('[]', '')
      const aitemValue = aitem.value
      const item = b.find((elem: any) => elem.name === name)

      item.value = aitemValue
    } //if radio

    if (aitem.fieldType === 'select') {
      const nameStr = aitem.name
      const name = nameStr.replace('[]', '')
      const aitemValue = aitem.value
      const item = b.find((elem: any) => elem.name === name)

      item.value = aitemValue
    }

    if (aitem.fieldType !== 'checkbox-group' && aitem.fieldType !== 'radio-group' && aitem.fieldType !== 'select') {
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

    //return reduced.concat(b)
  }

  // console.log('mergeObj return')
  // console.log(reduced.concat(b))

  return reduced.concat(b)
}

const thaiDatepicker = (el: any) => {
  $.datetimepicker.setLocale('th')

  // $.fn.datetimepicker.setLocale('th')

  // $(el).attr('readonly', true)
  //$(el).addClass('date-readonly')

  $(el).datetimepicker({
    timepicker: false,
    format: 'd/m/Y',
    lang: 'th',
    yearOffset: 543,
    validateOnBlur: false,
    regional: 'th',
    locale: 'th'
  })
}

export const getEdata = async (workData: any) => {
  let i: any
  const elem: any = workData

  // console.log('workData formrender')
  // console.log(workData)

  for (i in elem) {
    const index = checkIndex(elem[i]._id, workData)
    const tempData = []

    for (let idx = 0; idx < updateData.length; idx++) {
      if (updateData[idx].eid === elem[i]._id) {
        tempData.push(updateData[idx])
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

        const check: any = updateData.filter((obj: { eid: any; name: string | undefined }) => {
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

          updateData.push(newData)
        } else {
          updateData.filter((obj: { value: any; eid: any; name: string | undefined }) => {
            if (obj.name == id && obj.eid == parentIdArr[2]) {
              obj.value = v
            }
          })
        }
      })
  }
}

export const formRenderV2 = async (dataObj: string, handleEditWork: () => void) => {
  let i: any
  const elem: any = dataObj

  // console.log('elem ---- from render eform')
  // console.log(elem)

  for (i in elem) {
    // console.log('elem[i]._id')
    // console.log(elem[i]._id)
    // console.log($('#fb-render-' + elem[i]._id).length)

    // console.log(elem[i].form_template)

    if ($('#fb-render-' + elem[i]._id).length == 1) {
      $('#fb-render-' + elem[i]._id).formRender({
        dataType: 'json',
        formData: elem[i].form_template
      })
    } else {
      console.log('can not render eform id ' + elem[i]._id)
    }

    //#fb-render-671d9e8747ce4df2f9415c99

    $('input[type="date"]', '#fb-render-' + elem[i]._id)
      .addClass('datepicker')
      .attr('type', 'text')

    if (elem[i].privilege === 'view') {
      $('#fb-render-' + elem[i]._id)
        .find(
          $(
            'input[type="text"],input[type="radio"],input[type="checkbox"],input[type = "number"],input[type = "formulatext"],input[type = "hidden"],input[type = "date"] ,select, button, h1, h2, h3, p, address, output, canvas, blockquote, textarea, .checkbox-group, .radio-group'
          )
        )
        .attr('disabled', 'disabled')
    } // view

    if (elem[i].privilege === 'modify') {
      $('#fb-render-' + elem[i]._id)
        .find(
          $(
            'select,input[type="text"],input[type = "number"],input[type = "formulatext"],input[type = "hidden"],input[type = "date"] ,select, button, h1, h2, h3, p, address, output, canvas, blockquote, textarea, .checkbox-group, .radio-group'
          )
        )
        .attr('disabled', 'disabled')
        .on('change', function () {
          let v = $(this).val()
          let id = $(this).attr('id')
          let fieldType = $(this).attr('type')
          const parentId = $(this).parents('div.rendered-form').parent().attr('id')
          const parentIdArr: any = parentId?.split('-')

          if ($(this).is('.radio-group')) {
            console.log('.radio-group change ')
            const child = $('input', this)

            console.log(this)

            id = $(child[0]).attr('name')
            v = $("input[name='" + id + "']:checked").val()
            console.log('value')
            console.log(v)
            fieldType = 'radio-group'
          }

          if ($(this).is('.checkbox-group')) {
            const child = $('input', this)
            const values: any = []

            id = $(child[0]).attr('name')

            $.each($("input[name='" + id + "']:checked"), function () {
              values.push($(this).val())
            })

            v = values
            fieldType = 'checkbox-group'
          }

          const check: any = updateData.filter((obj: { eid: any; name: string | undefined }) => {
            if (obj.name == id && obj.eid == parentIdArr[2]) {
              return true
            }
          })

          if (check.length == 0) {
            const newData = {
              name: id,
              value: v,
              eid: parentIdArr[2],
              fieldType: fieldType
            }

            updateData.push(newData)
          } else {
            updateData.filter((obj: { value: any; eid: any; name: string | undefined }) => {
              if (obj.name == id && obj.eid == parentIdArr[2]) {
                obj.value = v
              }
            })
          }

          console.log('updateData')
          console.log(updateData)

          if (fieldType === 'checkbox-group' || fieldType === 'radio-group') {
            // sg found bug here
            console.log('checkbox-group change ----') //
            handleEditWork() // sg remark here
          }
        })
        .on('blur', function () {
          console.log('blur ----') //
          handleEditWork() // sg remark here
        })

      const selElem = elem[i]

      // console.log('elem[i] ' + i)
      // console.log(elem[i])

      //for (const elemField of selElem) {
      const reqField = selElem.require_field
      const editField = selElem.editable_field

      for (const fieldElem of reqField) {
        $('[id="' + fieldElem.id + '"]', '#fb-render-' + elem[i]._id).removeAttr('disabled')

        if (fieldElem.field === 'checkbox') {
          $('[name="' + fieldElem.id + '"]', '#fb-render-' + elem[i]._id).removeAttr('disabled')
        }

        if (fieldElem.field === 'radio') {
          $('[name="' + fieldElem.id + '"]', '#fb-render-' + elem[i]._id).removeAttr('disabled')
        }

        if (fieldElem.field === 'select') {
        }

        //$('#' + fieldElem.id).removeAttr('disabled')
      }

      if (editField) {
        for (const fieldElem of editField) {
          $('[id="' + fieldElem.id + '"]', '#fb-render-' + elem[i]._id).removeAttr('disabled')

          if (fieldElem.field === 'checkbox') {
            $('[name="' + fieldElem.id + '"]', '#fb-render-' + elem[i]._id).removeAttr('disabled')
          }

          if (fieldElem.field === 'radio') {
            $('[name="' + fieldElem.id + '"]', '#fb-render-' + elem[i]._id).removeAttr('disabled')
          }

          if (fieldElem.field === 'select') {
          }

          //$('#' + fieldElem.id).removeAttr('disabled')
        }
      }

      //}
    } //modify
  }

  thaiDatepicker('.datepicker')
}
