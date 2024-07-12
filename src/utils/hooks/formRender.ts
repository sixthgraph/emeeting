export const formRender = (dataObj: string) => {
  /**
 *
for (let i = 0; i < dataObj.length; i++) {
  const elem = dataObj[i]

  $('#fb-render-' + elem._id).formRender({
    dataType: 'json',
    formData: elem.form_template
  })
}
 */

  let i: any
  const elem: any = dataObj

  for (i in elem) {
    $('#fb-render-' + elem[i]._id).formRender({
      dataType: 'json',
      formData: elem[i].form_template
    })
  }
}
