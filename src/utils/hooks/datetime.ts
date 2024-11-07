import { useParams } from 'next/navigation'

export const Formatshortdate = (date: any) => {
  const params = useParams()
  const { lang: locale } = params

  const m_th_names = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย', 'ธ.ค.']

  const m_en_names = ['Jan', 'Feb', 'Mar', ' Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

  const d = new Date(date),
    curr_date = d.getDate(),
    curr_month = d.getMonth(),
    curr_year: number = d.getFullYear() + 543

  const formattedDate = d.toLocaleString()
  const curr_time = formattedDate.split(',')[1]

  if (locale == 'th') {
    return curr_date + ' ' + m_th_names[curr_month] + ' ' + curr_year + ' ' + curr_time
  }

  return curr_date + ' ' + m_en_names[curr_month] + ' ' + curr_year + ' ' + curr_time
}

// export const formRender = (data: string) => {
//   const dataObj = JSON.parse(data)

//   for (let i = 0; i < dataObj.length; i++) {
//     const elem = dataObj[i]

//     $('#fb-render-' + elem._id).formRender({
//       dataType: 'json',
//       formData: elem.form_template
//     })
//   }
// }
