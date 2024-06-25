var data2 = [
  {
    type: 'text',
    required: true,
    setCol: 'col-md-6',
    setBorder: 'noborder',
    label: 'เลขที่เอกสาร',
    className: 'form-control wid',
    name: 'text1575356100075',
    subtype: 'text'
  },
  {
    type: 'date',
    setCol: 'col-md-6',
    setBorder: 'noborder',
    label: 'วันที่เอกสาร',
    className: 'form-control txtDate wdate',
    name: 'txtdate'
  },
  {
    type: 'text',
    required: true,
    setCol: 'col-md-6',
    setBorder: 'noborder',
    label: 'จาก',
    className: 'form-control worigin',
    name: 'text1589363716332',
    subtype: 'text'
  },
  {
    type: 'text',
    required: true,
    setCol: 'col-md-6',
    setBorder: 'noborder',
    label: 'ถึง',
    className: 'form-control wownerbdsc',
    name: 'text1575356323588',
    subtype: 'text'
  },
  {
    type: 'text',
    required: true,
    setCol: 'col-md-12',
    setBorder: 'noborder',
    label: 'เรื่อง',
    className: 'form-control wsubject',
    name: 'text1575356270078',
    subtype: 'text'
  },
  { type: 'paragraph', subtype: 'p', setCol: 'col-md-12', setBorder: 'b-b', label: '<br>' },
  {
    type: 'header',
    subtype: 'h3',
    setCol: 'col-md-12',
    setBorder: 'noborder',
    label: 'แบบคำขอรับการฝึกอบรมภายนอก<br>',
    className: 'text-center bg-info text-white form-a'
  },
  {
    type: 'paragraph',
    subtype: 'p',
    setCol: 'col-md-12',
    setBorder: 'noborder',
    label:
      'ส่วนที่ 1 : หน่วยงานต้นสังกัด : พิจารณานำเสนอหลักสูตรและรายชื่อผู้เข้ารับการอบรมผ่านผู้บังคับบัญชาต้นสังกัดตามลำดับ<br>',
    className: 'text-info form-a'
  },
  {
    type: 'text',
    setCol: 'col-md-4',
    setBorder: 'noborder',
    label: 'ฝ่าย<br>',
    className: 'form-control form-a',
    name: 'text1676362947572',
    subtype: 'text'
  },
  {
    type: 'select',
    setCol: 'col-md-4',
    setBorder: 'noborder',
    label: 'กลุ่มงาน',
    className: 'form-control form-a',
    name: 'select1686566106298',
    values: [
      { label: 'กรุณาเลือกข้อมูล', value: '-', selected: true },
      { label: 'กลุ่มงานปฏิบัติการ', value: 'กลุ่มงานปฏิบัติการ' }
    ]
  },
  {
    type: 'select',
    setCol: 'col-md-4',
    setBorder: 'noborder',
    label: 'สายงาน',
    className: 'form-control form-a',
    name: 'select1686566114711',
    values: [
      { label: 'กรุณาเลือกข้อมูล', value: '-', selected: true },
      { label: 'กรรมการผู้จัดการ', value: 'กรรมการผู้จัดการ' },
      { label: 'สายงานบริหารงานปฏิบัติการ', value: 'สายงานบริหารงานปฏิบัติการ' },
      { label: 'สายงานสนับสนุนธุรกิจ', value: 'สายงานสนับสนุนธุรกิจ' }
    ]
  },
  {
    type: 'text',
    setCol: 'col-md-12',
    setBorder: 'noborder',
    label: 'หัวข้อการอบรม/สัมมนา<br>',
    className: 'form-control form-a',
    name: 'text1676362959495',
    subtype: 'text'
  },
  {
    type: 'text',
    setCol: 'col-md-4',
    setBorder: 'noborder',
    label: 'สถาบันที่จัดอบรม/สัมมนา<br>',
    className: 'form-control form-a',
    name: 'text1676362963817',
    subtype: 'text'
  },
  {
    type: 'text',
    setCol: 'col-md-4',
    setBorder: 'noborder',
    label: 'วันที่อบรม',
    className: 'form-control form-a',
    name: 'date1676363182219',
    subtype: 'text'
  },
  {
    type: 'text',
    setCol: 'col-md-4',
    setBorder: 'noborder',
    label: 'จำนวนวัน<br>',
    className: 'form-control form-a',
    name: 'text1676362964597',
    subtype: 'text'
  },
  {
    type: 'text',
    setCol: 'col-md-1',
    setBorder: 'noborder',
    label: 'ลำดับ<br>',
    className: 'form-control 1-1 form-a',
    name: 'text1681789834271',
    value: '1',
    subtype: 'text'
  },
  {
    type: 'text',
    setCol: 'col-md-6',
    setBorder: 'noborder',
    label: 'ชื่อ - สกุล<br>',
    className: 'form-control 1-1 form-a',
    name: 'text1676362977886',
    subtype: 'text'
  },
  {
    type: 'text',
    setCol: 'col-md-5',
    setBorder: 'noborder',
    label: 'ตำแหน่ง<br>',
    className: 'form-control 1-1 form-a',
    name: 'text1676362978263',
    subtype: 'text'
  },
  {
    type: 'paragraph',
    subtype: 'p',
    setCol: 'col-md-10',
    setBorder: 'noborder',
    label: '<br>',
    className: 'dummy-1-underline form-a'
  },
  {
    type: 'button',
    setCol: 'col-md-1',
    setBorder: 'noborder',
    label: 'เพิ่ม<br>',
    subtype: 'button',
    className: 'btn form-a btn-info',
    name: 'button1680598061594',
    style: 'info'
  },
  {
    type: 'button',
    setCol: 'col-md-1',
    setBorder: 'noborder',
    label: 'ลบ<br>',
    subtype: 'button',
    className: 'btn form-a btn-danger',
    name: 'button1680598052560',
    style: 'danger'
  },
  {
    type: 'textarea',
    hidelabel: true,
    setCol: 'col-md-12',
    setBorder: 'noborder',
    label: 'dummy-1',
    className: 'form-control form-a hide',
    name: 'dummy-1',
    subtype: 'textarea'
  },
  {
    type: 'textarea',
    setCol: 'col-md-12',
    setBorder: 'noborder',
    label:
      'ระบุรายละเอียดเพื่อประกอบการพิจารณา ได้แก่ วัตถุประสงค์ ประโยชน์ที่จะได้รับ การนำมาประยุกต์ใช้กับงาน หรืออื่นๆ<br>',
    className: 'form-control form-a',
    name: 'textarea1676362983946',
    subtype: 'textarea'
  },
  {
    type: 'textarea',
    setCol: 'col-md-12',
    setBorder: 'noborder',
    label: 'หมายเหตุ<br>',
    className: 'form-control form-a',
    name: 'textarea1694486069223',
    subtype: 'textarea'
  },
  {
    type: 'paragraph',
    subtype: 'p',
    setCol: 'col-md-12',
    setBorder: 'noborder',
    label: 'ผู้บริหารหน่วยงานต้นสังกัด : พิจารณาลงนามอนุมัติการเข้าฝึกอบรม/สัมมนา<br>',
    className: 'form-a'
  },
  {
    type: 'text',
    setCol: 'col-md-3',
    setBorder: 'noborder',
    label: 'ลงชื่อ (ผู้บริหารฝ่ายงาน)<br>',
    className: 'form-control form-a',
    name: 'txt_tsign_1',
    subtype: 'text'
  },
  {
    type: 'text',
    setCol: 'col-md-3',
    setBorder: 'noborder',
    label: 'ลงชื่อ (ผู้บริหารกลุ่มงาน)<br>',
    className: 'form-control form-a',
    name: 'txt_tsign_2',
    subtype: 'text'
  },
  {
    type: 'text',
    setCol: 'col-md-3',
    setBorder: 'noborder',
    label: 'ลงชื่อ (ผู้บริหารสายงาน)<br>',
    className: 'form-control form-a',
    name: 'txt_tsign_3',
    subtype: 'text'
  },
  {
    type: 'text',
    setCol: 'col-md-3',
    setBorder: 'noborder',
    label: 'ลงชื่อ (กรรมการผู้จัดการ)<br>',
    className: 'form-control form-a',
    name: 'txt_tsign_4',
    subtype: 'text'
  },
  {
    type: 'text',
    hidelabel: true,
    setCol: 'col-md-3',
    setBorder: 'noborder',
    label: 'ลงชื่อ (ผู้บริหารฝ่ายงาน)<br>',
    className: 'form-control form-a hide',
    name: 'txtsign_1',
    subtype: 'text'
  },
  {
    type: 'text',
    hidelabel: true,
    setCol: 'col-md-3',
    setBorder: 'noborder',
    label: 'ลงชื่อ (ผู้บริหารกลุ่มงาน)<br>',
    className: 'form-control form-a hide',
    name: 'txtsign_2',
    subtype: 'text'
  },
  {
    type: 'text',
    hidelabel: true,
    setCol: 'col-md-3',
    setBorder: 'noborder',
    label: 'ลงชื่อ (ผู้บริหารสายงาน)<br>',
    className: 'form-control form-a hide',
    name: 'txtsign_3',
    subtype: 'text'
  },
  {
    type: 'text',
    hidelabel: true,
    setCol: 'col-md-3',
    setBorder: 'noborder',
    label: 'ลงชื่อ (กรรมการผู้จัดการ)<br>',
    className: 'form-control form-a hide',
    name: 'txtsign_4',
    subtype: 'text'
  },
  {
    type: 'date',
    setCol: 'col-md-3',
    setBorder: 'noborder',
    label: 'วันที่',
    className: 'form-control form-a',
    name: 'txtdate_1'
  },
  {
    type: 'date',
    setCol: 'col-md-3',
    setBorder: 'noborder',
    label: 'วันที่',
    className: 'form-control form-a',
    name: 'txtdate_2'
  },
  {
    type: 'date',
    setCol: 'col-md-3',
    setBorder: 'noborder',
    label: 'วันที่',
    className: 'form-control form-a',
    name: 'txtdate_3'
  },
  {
    type: 'date',
    setCol: 'col-md-3',
    setBorder: 'noborder',
    label: 'วันที่',
    className: 'form-control form-a',
    name: 'txtdate_4'
  },
  {
    type: 'paragraph',
    subtype: 'p',
    setCol: 'col-md-12',
    setBorder: 'noborder',
    label:
      '<div>คำอธิบาย :</div><div>1. หน่วยงานต้นสังกัด กรอกข้อมูลเฉพาะส่วนที่ 1 เท่านั้น</div><div>2. กรรมการผู้จัดการ พิจารณาลงนามในกรณีต่อไปนี้ <br></div><div>&nbsp;&nbsp;&nbsp;&nbsp; 2.1 ผู้บริหารสายงานเป็นผู้อบรม</div><div>&nbsp;&nbsp;&nbsp;&nbsp; 2.2 ผู้อำนวยการฝ่ายตรวจสอบภายในเป็นผู้อบรม</div><div>&nbsp;&nbsp;&nbsp;&nbsp; 2.3 พนักงานสังกัดหน่วยงานขึ้นตรงต่อกรรมการผู้จัดการเป็นผู้อบรม</div><div>&nbsp;&nbsp;&nbsp;&nbsp; 2.4 เป็นการอบรม/อบรมพร้อมสอบ ประกาศนียบัตรที่ได้รับเงินสนับสนุนค่าประกาศนียบัตร (จ่ายรายเดือน)<br></div>',
    className: 'form-a'
  },
  { type: 'paragraph', subtype: 'p', setCol: 'col-md-12', setBorder: 'b-b', label: '<br>', className: 'form-a' },
  {
    type: 'paragraph',
    subtype: 'p',
    setCol: 'col-md-12',
    setBorder: 'noborder',
    label:
      'ส่วนที่ 2 : หน่วยงานดูแลงานทรัพยากรบุคคล : แจ้งค่าใช้จ่ายในการฝึกอบรม อนุมัติใช้งบประมาณ และมอบหมายการดำเนินการ และ หน่วยงานดูแลด้านการเงิน : ตรวจสอบงบประมาณ<br>',
    className: 'text-info form-b'
  },
  {
    type: 'paragraph',
    subtype: 'p',
    setCol: 'col-md-2',
    setBorder: 'noborder',
    label: 'ค่าอบรม/สัมนา<br>',
    className: 'form-b'
  },
  {
    type: 'paragraph',
    subtype: 'p',
    setCol: 'col-md-2',
    setBorder: 'noborder',
    label: 'จำนวนเงิน (ไม่รวมภาษีมูลค่าเพิ่ม)',
    className: 'form-b'
  },
  {
    type: 'paragraph',
    subtype: 'p',
    setCol: 'col-md-2',
    setBorder: 'noborder',
    label: 'ภาษีมูลค่าเพิ่ม',
    className: 'form-b'
  },
  {
    type: 'paragraph',
    subtype: 'p',
    setCol: 'col-md-2',
    setBorder: 'noborder',
    label: 'จำนวนเงิน(รวมภาษีมูลค่าเพิ่ม)',
    className: 'form-b'
  },
  {
    type: 'paragraph',
    subtype: 'p',
    setCol: 'col-md-2',
    setBorder: 'noborder',
    label: 'ภาษีหัก ณ ที่จ่าย',
    className: 'form-b'
  },
  {
    type: 'paragraph',
    subtype: 'p',
    setCol: 'col-md-2',
    setBorder: 'noborder',
    label: 'จำนวนเงินสุทธิ(รวมภาษีมูลค่าเพิ่มและหักภาษั ณ ที่จ่าย)',
    className: 'form-b'
  },
  {
    type: 'text',
    hidelabel: true,
    setCol: 'col-md-2',
    setBorder: 'noborder',
    label: 'ค่าอบรม/สัมนา ต่อ คน (บาท)<br>',
    className: 'form-control form-b',
    name: 'text1676363930918',
    subtype: 'text'
  },
  {
    type: 'text',
    hidelabel: true,
    setCol: 'col-md-2',
    setBorder: 'noborder',
    label: 'จำนวนเงิน (ไม่รวมภาษีมูลค่าเพิ่ม)<br>',
    className: 'form-control form-b',
    name: 'text1676363946328',
    subtype: 'text'
  },
  {
    type: 'text',
    hidelabel: true,
    setCol: 'col-md-2',
    setBorder: 'noborder',
    label: 'ภาษีมูลค่าเพิ่ม',
    className: 'form-control form-b',
    name: 'text1676363946460',
    subtype: 'text'
  },
  {
    type: 'text',
    hidelabel: true,
    setCol: 'col-md-2',
    setBorder: 'noborder',
    label: 'จำนวนเงิน(รวมภาษีมูลค่าเพิ่ม)<br>',
    className: 'form-control form-b',
    name: 'text1676363946594',
    subtype: 'text'
  },
  {
    type: 'text',
    hidelabel: true,
    setCol: 'col-md-2',
    setBorder: 'noborder',
    label: 'ภาษีหัก ณ ที่จ่าย<br>',
    className: 'form-control form-b',
    name: 'text1676363946744',
    subtype: 'text'
  },
  {
    type: 'text',
    hidelabel: true,
    setCol: 'col-md-2',
    setBorder: 'noborder',
    label: 'จำนวนเงินสุทธิ(รวมภาษีมูลค่าเพิ่มและหักภาษั ณ ที่จ่าย)<br>',
    className: 'form-control form-b',
    name: 'text1676363946893',
    subtype: 'text'
  },
  {
    type: 'text',
    hidelabel: true,
    setCol: 'col-md-2',
    setBorder: 'noborder',
    label: 'ค่าอบรม/สัมนา....คน (บาท)<br>',
    className: 'form-control form-b',
    name: 'text1676363997382',
    subtype: 'text'
  },
  {
    type: 'text',
    hidelabel: true,
    setCol: 'col-md-2',
    setBorder: 'noborder',
    label: 'จำนวนเงิน (ไม่รวมภาษีมูลค่าเพิ่ม)<br>',
    className: 'form-control form-b',
    name: 'text1676364041166',
    subtype: 'text'
  },
  {
    type: 'text',
    hidelabel: true,
    setCol: 'col-md-2',
    setBorder: 'noborder',
    label: 'ภาษีมูลค่าเพิ่ม',
    className: 'form-control form-b',
    name: 'text1676364194169',
    subtype: 'text'
  },
  {
    type: 'text',
    hidelabel: true,
    setCol: 'col-md-2',
    setBorder: 'noborder',
    label: 'จำนวนเงิน(รวมภาษีมูลค่าเพิ่ม)<br>',
    className: 'form-control form-b',
    name: 'text1676364195519',
    subtype: 'text'
  },
  {
    type: 'text',
    hidelabel: true,
    setCol: 'col-md-2',
    setBorder: 'noborder',
    label: 'ภาษีหัก ณ ที่จ่าย<br>',
    className: 'form-control form-b',
    name: 'text1676364196583',
    subtype: 'text'
  },
  {
    type: 'text',
    hidelabel: true,
    setCol: 'col-md-2',
    setBorder: 'noborder',
    label: 'จำนวนเงินสุทธิ(รวมภาษีมูลค่าเพิ่มและหักภาษั ณ ที่จ่าย)<br>',
    className: 'form-control form-b',
    name: 'text1676364197468',
    subtype: 'text'
  },
  {
    type: 'checkbox-group',
    label: '<br>',
    setCol: 'col-md-6',
    setBorder: 'noborder',
    className: 'form-b',
    name: 'checkbox-group1689567666702',
    values: [{ label: 'ค่าใช้จ่ายอื่นๆ', value: 'option-1' }]
  },
  {
    type: 'text',
    setCol: 'col-md-6',
    setBorder: 'noborder',
    label: 'จำนวนเงิน<br>',
    className: 'form-control form-b fusion-a sum-a',
    name: 'text1689567691406',
    subtype: 'text'
  },
  {
    type: 'text',
    setCol: 'col-md-12',
    setBorder: 'noborder',
    label: 'จำนวนสุทธิที่ต้องชำระ (บาท) show<br>',
    className: 'form-control form-b stotal-a',
    name: 'text1676364210142',
    subtype: 'text'
  },
  {
    type: 'text',
    setCol: 'col-md-12',
    setBorder: 'noborder',
    label: 'จำนวนสุทธิที่ต้องชำระ (บาท) hide<br>',
    className: 'form-control form-b total-a sum-a',
    name: 'text1689741475101',
    subtype: 'text'
  },
  {
    type: 'checkbox-group',
    label: 'เงื่อนไขการชำระเงิน',
    setCol: 'col-md-12',
    setBorder: 'noborder',
    inline: true,
    className: 'form-b',
    name: 'checkbox-group1676364279444',
    values: [
      { label: 'ก่อนอบรม', value: 'ก่อนอบรม' },
      { label: 'หลังอบรม', value: 'หลังอบรม' }
    ]
  },
  {
    type: 'text',
    setCol: 'col-md-6',
    setBorder: 'noborder',
    label: 'ชำระเงิน ให้แก่<br>',
    className: 'form-control form-b',
    name: 'text1676364861431',
    subtype: 'text'
  },
  {
    type: 'date',
    setCol: 'col-md-6',
    setBorder: 'noborder',
    label: 'ภายในวันที่',
    className: 'form-control form-b',
    name: 'date1676364895087'
  },
  {
    type: 'text',
    setCol: 'col-md-6',
    setBorder: 'noborder',
    label: 'เจ้าหน้าที่ฝึกอบรม<br>',
    className: 'form-control form-b',
    name: 'text1676364946959',
    subtype: 'text'
  },
  {
    type: 'date',
    setCol: 'col-md-6',
    setBorder: 'noborder',
    label: 'วันที่',
    className: 'form-control form-b',
    name: 'date1676364950561'
  },
  {
    type: 'text',
    setCol: 'col-md-6',
    setBorder: 'noborder',
    label: 'รหัส<br>',
    className: 'form-control form-b',
    name: 'text1676365139215',
    subtype: 'text'
  },
  {
    type: 'text',
    setCol: 'col-md-12',
    setBorder: 'noborder',
    label: 'จำนวนเงิน (บาท)<br>',
    className: 'form-control form-b',
    name: 'text1676365156615',
    subtype: 'text'
  },
  {
    type: 'checkbox-group',
    hidelabel: true,
    label: 'เงื่อนไขการชำระเงิน',
    setCol: 'col-md-12',
    setBorder: 'noborder',
    inline: true,
    className: 'form-b',
    name: 'checkbox-group1676365219056',
    values: [
      { label: 'มีงบประมาณคงเหลือเพียงพอ', value: 'มีงบประมาณคงเหลือเพียงพอ' },
      { label: 'งบประมาณคงเหลือไม่เพียงพอ', value: 'งบประมาณคงเหลือไม่เพียงพอ' }
    ]
  },
  {
    type: 'text',
    setCol: 'col-md-6',
    setBorder: 'noborder',
    label: 'ผู้ตรวจสอบงบประมาณ<br>',
    className: 'form-control form-b',
    name: 'text1676365287461',
    subtype: 'text'
  },
  {
    type: 'date',
    setCol: 'col-md-6',
    setBorder: 'noborder',
    label: 'วันที่<br>',
    className: 'form-control form-b',
    name: 'date1676365117977'
  },
  {
    type: 'checkbox-group',
    hidelabel: true,
    label: 'Checkbox Group',
    setCol: 'col-md-12',
    setBorder: 'noborder',
    className: 'form-b',
    name: 'rad_approve_5',
    values: [
      {
        label: 'อนุมัติใช้งบประมาณเพื่อดำเนินการ (กรณีค่าใช้จ่ายไม่เกิน 100,000 บาท)',
        value: 'อนุมัติใช้งบประมาณเพื่อดำเนินการ (กรณีค่าใช้จ่ายไม่เกิน 100,000 บาท)'
      },
      { label: 'มอบหมาย Training Center ดำเนินการต่อไป', value: 'มอบหมาย Training Center ดำเนินการต่อไป' },
      { label: 'อื่น ๆ (โปรดระบุ)', value: 'อื่น ๆ (โปรดระบุ)' }
    ]
  },
  {
    type: 'text',
    setCol: 'col-md-12',
    setBorder: 'noborder',
    label: 'โปรดระบุ<br>',
    className: 'form-control form-b',
    name: 'txt_remark_5',
    subtype: 'text'
  },
  {
    type: 'text',
    setCol: 'col-md-3',
    setBorder: 'noborder',
    label: 'ลงชื่อ<br>',
    className: 'form-control form-b',
    name: 'txt_tsign_5',
    value: 'นางเจตนา ใยศิริ',
    subtype: 'text'
  },
  {
    type: 'text',
    setCol: 'col-md-3',
    setBorder: 'noborder',
    label: 'ตำแหน่ง<br>',
    className: 'form-control form-b',
    name: 'text1681710948891',
    value: 'ผู้อำนวยการฝ่าย',
    subtype: 'text'
  },
  {
    type: 'text',
    setCol: 'col-md-3',
    setBorder: 'noborder',
    label: 'ฝ่าย<br>',
    className: 'form-control form-b',
    name: 'text1681710949208',
    value: 'ฝ่ายทรัพยากรบุคคล',
    subtype: 'text'
  },
  {
    type: 'date',
    setCol: 'col-md-3',
    setBorder: 'noborder',
    label: 'วันที่',
    className: 'form-control form-b',
    name: 'txtdate_5'
  },
  { type: 'paragraph', subtype: 'p', setCol: 'col-md-12', setBorder: 'b-b', label: '<br>', className: 'form-b' },
  {
    type: 'paragraph',
    subtype: 'p',
    setCol: 'col-md-12',
    setBorder: 'noborder',
    label:
      'ส่วนที่ 3 : สำหรับผู้มีอำนาจอนุมัติใช้งบประมาณ : พิจารณาอนุมัติใช้งบประมาณเพื่อดำเนินการ (กรณีค่าใช้จ่ายเกิน 100,000 บาท)<br>',
    className: 'text-info form-c'
  },
  {
    type: 'checkbox-group',
    hidelabel: true,
    label: 'เงื่อนไขการชำระเงิน',
    setCol: 'col-md-12',
    setBorder: 'noborder',
    inline: true,
    className: 'form-c',
    name: 'checkbox-group1676365467687',
    values: [
      {
        label:
          'ค่าใช้จ่ายมากกว่า 100,000 บาท แต่ไม่เกิน 5,000,000 บาท ผู้บริหารสายงาน เป็นผู้มีอำนาจอนุมัติใช้งบประมาณ (ฝ่ายทรัพยการบุคคลเป็นหน่วยงานขึ้นตรงต่อกรรมการผู้จัดการ)',
        value:
          'ค่าใช้จ่ายมากกว่า 100,000 บาท แต่ไม่เกิน 5,000,000 บาท ผู้บริหารสายงาน เป็นผู้มีอำนาจอนุมัติใช้งบประมาณ (ฝ่ายทรัพยการบุคคลเป็นหน่วยงานขึ้นตรงต่อกรรมการผู้จัดการ)'
      }
    ]
  },
  {
    type: 'paragraph',
    subtype: 'p',
    setCol: 'col-md-4',
    setBorder: 'noborder',
    label: '<br>',
    className: 'form-c'
  },
  {
    type: 'checkbox-group',
    hidelabel: true,
    label: '<br>',
    setCol: 'col-md-4',
    setBorder: 'noborder',
    inline: true,
    className: 'form-c',
    name: 'rad_approve_6',
    values: [
      { label: 'อนุมัติ', value: 'อนุมัติ' },
      { label: 'ไม่อนุมัติ', value: 'ไม่อนุมัติ' }
    ]
  },
  {
    type: 'paragraph',
    subtype: 'p',
    setCol: 'col-md-12',
    setBorder: 'noborder',
    label: '<br>',
    className: 'form-c'
  },
  {
    type: 'text',
    setCol: 'col-md-6',
    setBorder: 'noborder',
    label: 'ลงชื่อ<br>',
    className: 'form-control form-c',
    name: 'txt_tsign_6',
    subtype: 'text'
  },
  {
    type: 'date',
    setCol: 'col-md-6',
    setBorder: 'noborder',
    label: 'วันที่',
    className: 'form-control form-c',
    name: 'txtdate_6'
  },
  { type: 'paragraph', subtype: 'p', setCol: 'col-md-12', setBorder: 'b-b', label: '<br>', className: 'form-c' },
  {
    type: 'paragraph',
    subtype: 'p',
    setCol: 'col-md-12',
    setBorder: 'noborder',
    label: 'ส่วนที่ 4 : สำหรับหน่วยงานดูแลด้านการเงิน : พิจารณาอนุมัติชำระเงิน<br>',
    className: 'text-info form-d'
  },
  {
    type: 'checkbox-group',
    hidelabel: true,
    label: 'เงื่อนไขการชำระเงิน',
    setCol: 'col-md-12',
    setBorder: 'noborder',
    inline: true,
    className: 'form-d',
    name: 'checkbox-group1676365731611',
    values: [
      {
        label: 'กรณีค่าใช้จ่ายไม่เกิน 30,000 บาท ผู้อำนวยการฝ่ายบัญชีและการเงิน เป็นผู้มีอำนาจอนุมัติชำระเงิน',
        value: 'กรณีค่าใช้จ่ายไม่เกิน 30,000 บาท ผู้อำนวยการฝ่ายบัญชีและการเงิน เป็นผู้มีอำนาจอนุมัติชำระเงิน'
      },
      {
        label:
          'กรณีค่าใช้จ่ายมากกว่า 30,000 บาท แต่ไม่เกิน 5,000,000 บาท สายงานสนับสนุนธุรกิจ เป็นผู้มีอำนาจอนุมัติชำระเงิน',
        value:
          'กรณีค่าใช้จ่ายมากกว่า 30,000 บาท แต่ไม่เกิน 5,000,000 บาท สายงานสนับสนุนธุรกิจ เป็นผู้มีอำนาจอนุมัติชำระเงิน'
      },
      {
        label: 'กรณีค่าใช้จ่ายมากกว่า 5,000,000 บาท กรรมการผู้จัดการ เป็นผู้มีอำนาจอนุมัติชำระเงิน',
        value: 'กรณีค่าใช้จ่ายมากกว่า 5,000,000 บาท กรรมการผู้จัดการ เป็นผู้มีอำนาจอนุมัติชำระเงิน'
      }
    ]
  },
  {
    type: 'paragraph',
    subtype: 'p',
    setCol: 'col-md-4',
    setBorder: 'noborder',
    label: '<br>',
    className: 'form-d'
  },
  {
    type: 'checkbox-group',
    hidelabel: true,
    label: '<br>',
    setCol: 'col-md-4',
    setBorder: 'noborder',
    inline: true,
    className: 'form-d',
    name: 'rad_approve_7',
    values: [
      { label: 'อนุมัติ', value: 'อนุมัติ' },
      { label: 'ไม่อนุมัติ', value: 'ไม่อนุมัติ' }
    ]
  },
  {
    type: 'paragraph',
    subtype: 'p',
    setCol: 'col-md-12',
    setBorder: 'noborder',
    label: '<br>',
    className: 'form-d'
  },
  {
    type: 'text',
    setCol: 'col-md-3',
    setBorder: 'noborder',
    label: 'ลงชื่อ<br>',
    className: 'form-control form-d',
    name: 'txt_tsign_7',
    subtype: 'text'
  },
  {
    type: 'text',
    setCol: 'col-md-3',
    setBorder: 'noborder',
    label: 'ตำแหน่ง<br>',
    className: 'form-control form-d',
    name: 'text1684828384063',
    subtype: 'text'
  },
  {
    type: 'text',
    setCol: 'col-md-3',
    setBorder: 'noborder',
    label: 'ฝ่าย<br>',
    className: 'form-control form-d',
    name: 'text1684828384842',
    subtype: 'text'
  },
  {
    type: 'date',
    setCol: 'col-md-3',
    setBorder: 'noborder',
    label: 'วันที่',
    className: 'form-control form-d',
    name: 'txtdate_7'
  },
  {
    type: 'text',
    hidelabel: true,
    setCol: 'col-md-4',
    setBorder: 'noborder',
    label: 'ลงชื่อ<br>',
    className: 'form-control form-b hide',
    name: 'txtsign_5',
    subtype: 'text'
  },
  {
    type: 'text',
    hidelabel: true,
    setCol: 'col-md-4',
    setBorder: 'noborder',
    label: 'ลงชื่อ<br>',
    className: 'form-control form-c hide',
    name: 'txtsign_6',
    subtype: 'text'
  },
  {
    type: 'text',
    hidelabel: true,
    setCol: 'col-md-4',
    setBorder: 'noborder',
    label: 'ลงชื่อ<br>',
    className: 'form-control form-d hide',
    name: 'txtsign_7',
    subtype: 'text'
  }
]

$(document).ready(function () {
  setTimeout(() => {
    alert('start render')
    $('.fb-render').formRender({
      dataType: 'json',
      formData: data2
    })
  }, 500)
})
