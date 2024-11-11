'use client'

import { useEffect, useState } from 'react'
import type { SyntheticEvent } from 'react'

// MUI Imports
import Script from 'next/script'
import { useParams, useRouter } from 'next/navigation'

import '@/css/jquery.datetimepicker.css'

import { styled } from '@mui/material/styles'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import TabList from '@mui/lab/TabList'

import Tab from '@mui/material/Tab'
import TabContext from '@mui/lab/TabContext'
import TabPanel from '@mui/lab/TabPanel'

import MuiAccordion from '@mui/material/Accordion'
import MuiAccordionSummary from '@mui/material/AccordionSummary'
import MuiAccordionDetails from '@mui/material/AccordionDetails'
import type { AccordionProps } from '@mui/material/Accordion'
import type { AccordionSummaryProps } from '@mui/material/AccordionSummary'
import type { AccordionDetailsProps } from '@mui/material/AccordionDetails'

// Third-party Imports
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import {
  Alert,
  AlertTitle,
  Badge,
  Box,
  Button,
  CardActions,
  CardHeader,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  LinearProgress,
  Tooltip
} from '@mui/material'

import Timeline from '@mui/lab/Timeline'
import TimelineItem from '@mui/lab/TimelineItem'
import TimelineSeparator from '@mui/lab/TimelineSeparator'
import TimelineDot from '@mui/lab/TimelineDot'
import TimelineConnector from '@mui/lab/TimelineConnector'
import TimelineContent from '@mui/lab/TimelineContent'
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent'

import { useSession } from 'next-auth/react'

import CustomAvatar from '@/@core/components/mui/Avatar'
import { getInitials } from '@/utils/getInitials'
import { formRenderV2, getEdata } from '@/utils/hooks/formRender'

import axios from '@/utils/axios'
import DocumentListTable from '../workV2/DocumentListTable'

// import { getDocument } from '@/components/attachment'

const getDocuments = async (wid: any) => {
  const reqBody = {
    wid: wid,
    itemno: ''
  }

  try {
    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/attachment/list`, reqBody)

    let resData = response.data.data

    if (!resData) {
      resData = []
    }

    return resData
  } catch (error: any) {
    console.log('Editwork failed. ', error.message)
  }
}

// Styled component for Accordion component
const Accordion = styled(MuiAccordion)<AccordionProps>({
  margin: '0 !important',
  borderRadius: 0,
  boxShadow: 'none !important',
  border: '1px solid var(--mui-palette-divider)',
  '&:not(:last-of-type)': {
    borderBottom: 0
  },
  '&:before': {
    display: 'none'
  },
  '&:first-of-type': {
    '& .MuiButtonBase-root': {
      borderTopLeftRadius: 'var(--mui-shape-borderRadius)',
      borderTopRightRadius: 'var(--mui-shape-borderRadius)'
    }
  },
  '&:last-of-type': {
    '& .MuiAccordionSummary-root:not(.Mui-expanded)': {
      borderBottomLeftRadius: 'var(--mui-shape-borderRadius)',
      borderBottomRightRadius: 'var(--mui-shape-borderRadius)'
    }
  }
})

// Styled component for AccordionSummary component
const AccordionSummary = styled(MuiAccordionSummary)<AccordionSummaryProps>(({ theme }) => ({
  borderBlockEnd: '0 !important',
  borderBlock: '0 !important',
  minHeight: theme.spacing(11.5),
  transition: 'min-height 0.15s ease-in-out',
  backgroundColor: 'var(--mui-palette-customColors-greyLightBg)',
  '&.Mui-expanded': {
    minHeight: theme.spacing(11.5),
    borderBlockEnd: '0px solid var(--mui-palette-divider) !important',
    '& .MuiAccordionSummary-expandIconWrapper': {
      transform: 'rotate(180deg)'
    }
  }
}))

// Styled component for AccordionDetails component
const AccordionDetails = styled(MuiAccordionDetails)<AccordionDetailsProps>(({ theme }) => ({
  paddingBlockStart: `${theme.spacing(6)} !important`
}))

const WorkProfile = ({
  workData,
  conditionData,
  notificationData,
  documentList,
  nodeData
}: {
  workData?: any
  conditionData?: any
  notificationData?: any
  documentList?: any
  nodeData?: any
}) => {
  const [open, setOpen] = useState<boolean>(false)
  const [reqFieldData, setReqFieldData] = useState([])
  const [firstReqField, setFirstReqField] = useState<any>('')

  let eformData = workData?.eformdata
  const workInprocess = workData?.workinprocess
  const curBlockId = workData?.blockid
  const rolbackConditiondata = conditionData
  const curWorkinprocess = workInprocess.find((elem: any) => elem.pid == curBlockId)
  const curNodeData = nodeData //const curNodeData = curWorkinprocess?.nodeinfo[0]
  const curTask = curWorkinprocess?.nodeinfo[0].task
  const documentProperties = curWorkinprocess?.nodeinfo[0].document_list
  const [attachment, setAttachment] = useState(...[workData?.attachment])
  const eformList = curNodeData[0].eformlist

  // console.log('workData ===')
  // console.log(workData)

  // console.log('attachment ===')
  // console.log(attachment)
  console.log('eformData from === workData?.eformdata')
  console.log(eformData)

  console.log('conditionData -----')
  console.log(conditionData)

  // console.log('notificationData----')
  // console.log(notificationData)

  // console.log('documentList')
  // console.log(documentList)
  // console.log('curNodeData -------')
  // console.log(curNodeData)

  if (eformList) {
    for (const item of eformList) {
      eformData.find((elem: any) => {
        if (elem.form_id === item.formid) {
          elem.require_field = item.require_field
          elem.editable_field = item.editable_field
          elem.privilege = item.privilege
        }
      })
    }

    eformData = eformData.filter((elem: any) => {
      return elem.privilege !== 'disable' && elem.privilege !== undefined
    })
  }

  // console.log(eFormDataObj[2].privilege)

  if (documentList && documentProperties) {
    for (const item of documentList) {
      const docId = documentProperties.find((elem: any) => elem.document_id === item._id)

      if (docId) {
        item.action = docId.action
      }
    }
  }

  const router = useRouter()
  const { data: session } = useSession()

  // const token = session?.user.token
  const eform: any = eformData

  for (const i in eform) {
    eformData[i]._id = eform[i].Id
  }

  const documentData = {
    wid: workData?.wid,
    email: session?.user.email,
    dep: workData?.curdep,
    rid: workData?.workflowid,
    pid: workData?.blockid //attachment: attachment //attachment: workData?.attachment
  }

  const [value, setValue] = useState('1')
  const [dialogTitle, setDialogTitle] = useState('Title')
  const [reqStatus, setReqStatus] = useState<boolean>(false)
  const [curTab, setCurTab] = useState('forms')
  const [dialogMsg, setDialogMsg] = useState('Msg')

  const [expanded, setExpanded] = useState<string | false>('panel-' + eformData[0]?.form_id)
  const params = useParams()
  const { lang: locale } = params
  const basepath = process.env.NEXT_PUBLIC_BASEPATH
  const activity = workData.activity

  useEffect(() => {
    if (curNodeData[0].eformlist) {
      const eformData = curNodeData[0].eformlist

      for (const item of eformData) {
        const reqField = item.require_field

        if (reqField.length > 0 && item.privilege === 'modify') {
          setReqStatus(true)
        }
      }
    }

    handleCheckDocument()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [curNodeData, curNodeData.eformlist])

  useEffect(() => {
    if (curTab == 'forms') {
      setTimeout(() => {
        checkRequireField()
      }, 300)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [curTab])

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue)
  }

  const handleOpenDialog = () => {
    setOpen(true)
  }

  const toastHandler = (str: any, type: any) => {
    console.log('toastHandler start')
    console.log(str)

    if (type === 'success') {
      toast.success(str)
    }

    if (type === 'error') {
      toast.error(str)
    }
  }

  const handleCheckDocument = async () => {
    const wid = workData?.wid

    getDocuments(wid).then(resData => {
      // console.log('handleCheckDocument return')
      // console.log(resData)
      mapDocument(resData)
    })

    // getDocument(wid).then(resData => {
    //   console.log('handleCheckDocument return')
    //   console.log(resData)
    //   mapDocument(resData)
    // })
  }

  const mapDocument = async (resData: any) => {
    const attData = resData

    if (documentList) {
      for (const item of documentList) {
        const findRefId = attData.find((elem: any) => elem.refid === item._id)

        if (!findRefId) {
          console.log('not found --- ')

          const newData = {
            allowupdate: 'Y',
            attachdate: '',
            attachname: '',
            dep: '',
            filename: item.document_name,
            linkwid: '-',
            uid: '',
            wid: '',
            refid: item._id,
            action: item.action,
            format: item.format,
            size: item.size
          }

          resData.push(newData)

          console.log('newData ---')
          console.log(newData)
        }
      }
    }

    setAttachment(resData)
  }

  const handleClose = () => {
    setOpen(false)
    setReqFieldData([])
    const reqField = document.getElementById(firstReqField) as HTMLInputElement

    if (reqField) {
      setTimeout(() => {
        reqField.focus()
      }, 300)
    }

    setTimeout(() => {
      setFirstReqField('')
    }, 500)
  }

  // States

  const handleAccordionChange = (panel: string) => (event: SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false)
  }

  const handleEditwork = async () => {
    const eformData = await getEdata(workData.eformdata)

    workData.eformdata = eformData

    const reqBody = workData

    //return //sg stop here

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/work/edit`, reqBody)

      if (response.data.message.includes('success')) {
        toastHandler('Successfully saved!', 'success')
      } else {
        toastHandler('Save eform data fails!', 'error')
      }
    } catch (error: any) {
      console.log('Editwork failed. ', error.message)
    }
  }

  const handleNotificateion = async () => {
    console.log('start handleNotificateion')
    console.log('notificationData ===')
    console.log(notificationData)

    let pass = false

    if (notificationData) {
      for (const item of notificationData) {
        // console.log('-------mail item-------')
        // console.log(item)

        if (item.status === 'active') {
          const reqData: any = {}

          reqData.action = item.action
          reqData.message = item.message
          reqData.from = item.from
          reqData.title = item.title

          if (item.send_type.includes('send_email')) {
            reqData.email = []

            const emailList = []

            const toPerson = item.to_person

            for (const person of toPerson) {
              emailList.push(person.userid)
            }

            const toDapt = item.to_dept

            for (const dept of toDapt) {
              if (dept.bid === 'next-worker') {
                const dept_email = conditionData[0].userid

                if (dept_email) {
                  emailList.push(dept_email)
                }
              }

              if (dept.bid === 'requestor') {
                const dept_email = workData.usercreateinfo[0].email

                if (dept_email) {
                  emailList.push(dept_email)
                }
              }

              if (dept.bid === 'previous-worker') {
                const workInProcess = workData.workinprocess
                const dept_email = workInProcess[workInProcess.length - 1].senderuid

                if (dept_email) {
                  emailList.push(dept_email)
                }
              }
            }

            reqData.email = emailList
            console.log('send email by reqData')
            console.log(reqData)

            try {
              const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/work/send-notification`, reqData)

              if (response.data.message === 'success') {
                //pass = true
                console.log('send notification by email success')
              }
            } catch (error: any) {
              console.log('send notification failed. ', error.message)
            }
          }
        }
      }

      pass = true
    } else {
      pass = true
    } //if notificationData

    return pass
  }

  const handleDecision = async () => {
    console.log('start handleDecision')

    const newcondition = []

    conditionData = rolbackConditiondata

    if (conditionData.length > 1) {
      //console.log('cond_item----')

      let i = 0
      let curboolean = false

      for (const cond_item of conditionData) {
        console.log('--condition-' + i)
        console.log(cond_item.conditions)

        if (cond_item.condition == '') {
          console.log('no cond')
        } else if (cond_item.conditions.valid == false) {
          conditionData.splice(i)
        } else {
          //check rules ohm
          const conditions = JSON.parse(cond_item.conditions)

          const mainoper = conditions.condition
          const rules = conditions.rules

          // console.log('rules of condition-' + i)
          // console.log(rules)
          let j = 0

          for (const rule_item of rules) {
            const curelementid = rule_item.id
            const oper = rule_item.operator
            const inputField: any = document.getElementById(curelementid) as HTMLInputElement

            // Get the value of the input field
            const value = inputField.value

            console.log('--start ' + i + '.' + j)

            switch (oper) {
              case 'equal':
                if (value == rule_item.value) {
                  if (j == 0) {
                    curboolean = true
                  } else {
                    if (mainoper == 'AND') {
                      curboolean = curboolean && true
                    } else {
                      curboolean = curboolean || true
                    }
                  }
                } else {
                  if (j == 0) {
                    curboolean = false
                  } else {
                    if (mainoper == 'AND') {
                      curboolean = curboolean && false
                    } else {
                      curboolean = curboolean || false
                    }
                  }
                }

                console.log('curboolean equal = ' + curboolean)
                break
              case 'not_equal':
                if (value !== rule_item.value) {
                  if (j == 0) {
                    curboolean = true
                  } else {
                    if (mainoper == 'AND') {
                      curboolean = curboolean && true
                    } else {
                      curboolean = curboolean || true
                    }
                  }
                } else {
                  if (j == 0) {
                    curboolean = false
                  } else {
                    if (mainoper == 'AND') {
                      curboolean = curboolean && false
                    } else {
                      curboolean = curboolean || false
                    }
                  }
                }

                console.log('curboolean not_equal = ' + curboolean)
                break
              case 'greater':
                if (value > rule_item.value) {
                  if (j == 0) {
                    curboolean = true
                  } else {
                    if (mainoper == 'AND') {
                      curboolean = curboolean && true
                    } else {
                      curboolean = curboolean || true
                    }
                  }
                } else {
                  if (j == 0) {
                    curboolean = false
                  } else {
                    if (mainoper == 'AND') {
                      curboolean = curboolean && false
                    } else {
                      curboolean = curboolean || false
                    }
                  }
                }

                console.log('curboolean greater = ' + curboolean)
                break
              case 'greater_or_equal':
                if (value >= rule_item.value) {
                  if (j == 0) {
                    curboolean = true
                  } else {
                    if (mainoper == 'AND') {
                      curboolean = curboolean && true
                    } else {
                      curboolean = curboolean || true
                    }
                  }
                } else {
                  if (j == 0) {
                    curboolean = false
                  } else {
                    if (mainoper == 'AND') {
                      curboolean = curboolean && false
                    } else {
                      curboolean = curboolean || false
                    }
                  }
                }

                console.log('curboolean greater_or_equal = ' + curboolean)
                break
              case 'less':
                if (value < rule_item.value) {
                  if (j == 0) {
                    curboolean = true
                  } else {
                    if (mainoper == 'AND') {
                      curboolean = curboolean && true
                    } else {
                      curboolean = curboolean || true
                    }
                  }
                } else {
                  if (j == 0) {
                    curboolean = false
                  } else {
                    if (mainoper == 'AND') {
                      curboolean = curboolean && false
                    } else {
                      curboolean = curboolean || false
                    }
                  }
                }

                console.log('curboolean less = ' + curboolean)
                break
              case 'less_or_equal':
                if (value <= rule_item.value) {
                  if (j == 0) {
                    curboolean = true
                  } else {
                    if (mainoper == 'AND') {
                      curboolean = curboolean && true
                    } else {
                      curboolean = curboolean || true
                    }
                  }
                } else {
                  if (j == 0) {
                    curboolean = false
                  } else {
                    if (mainoper == 'AND') {
                      curboolean = curboolean && false
                    } else {
                      curboolean = curboolean || false
                    }
                  }
                }

                console.log('curboolean less_or_equal = ' + curboolean)
                break
              case 'is_not_empty':
                if (value.length > 0) {
                  if (j == 0) {
                    curboolean = true
                  } else {
                    if (mainoper == 'AND') {
                      curboolean = curboolean && true
                    } else {
                      curboolean = curboolean || true
                    }
                  }
                } else {
                  if (j == 0) {
                    curboolean = false
                  } else {
                    if (mainoper == 'AND') {
                      curboolean = curboolean && false
                    } else {
                      curboolean = curboolean || false
                    }
                  }
                }

                console.log('curboolean is_not_empty[' + value.length + '] = ' + curboolean)
                break
              case 'is_empty':
                if (value.length <= 0) {
                  if (j == 0) {
                    curboolean = true
                  } else {
                    if (mainoper == 'AND') {
                      curboolean = curboolean && true
                    } else {
                      curboolean = curboolean || true
                    }
                  }
                } else {
                  if (j == 0) {
                    curboolean = false
                  } else {
                    if (mainoper == 'AND') {
                      curboolean = curboolean && false
                    } else {
                      curboolean = curboolean || false
                    }
                  }
                }

                console.log('curboolean is_empty[' + value.length + '] = ' + curboolean)
                break
              case 'in':
                if (value.includes(rule_item.value)) {
                  if (j == 0) {
                    curboolean = true
                  } else {
                    if (mainoper == 'AND') {
                      curboolean = curboolean && true
                    } else {
                      curboolean = curboolean || true
                    }
                  }
                } else {
                  if (j == 0) {
                    curboolean = false
                  } else {
                    if (mainoper == 'AND') {
                      curboolean = curboolean && false
                    } else {
                      curboolean = curboolean || false
                    }
                  }
                }

                console.log('curboolean is_empty[' + value.length + '] = ' + curboolean)
                break
              case 'not_in':
                if (!value.includes(rule_item.value)) {
                  if (j == 0) {
                    curboolean = true
                  } else {
                    if (mainoper == 'AND') {
                      curboolean = curboolean && true
                    } else {
                      curboolean = curboolean || true
                    }
                  }
                } else {
                  if (j == 0) {
                    curboolean = false
                  } else {
                    if (mainoper == 'AND') {
                      curboolean = curboolean && false
                    } else {
                      curboolean = curboolean || false
                    }
                  }
                }

                console.log('curboolean is_empty[' + value.length + '] = ' + curboolean)
                break
            }

            j = j + 1
          }
        }

        console.log('curboolean----' + i)
        console.log(curboolean)

        if (curboolean == false) {
          //conditionData.splice(i, 1)
        } else {
          newcondition.push(conditionData[i])
        }

        i = i + 1
      }

      conditionData = []
      conditionData = newcondition
      console.log('conditiondata after slice[' + i + ']---')
      console.log(conditionData)
    }
  }

  // const checkCondition = (condition: any) => {
  //   return true
  // }

  const handleTask = async () => {
    console.log('-----start handleTask-------')
    console.log('curTask --- ')
    console.log(curTask)

    if (reqFieldData.length > 0) {
      setReqFieldData([])
    }

    let inputPass = true

    if (conditionData[0] !== 'null' && conditionData[0] !== 'end-process' && workData.action == '') {
      if (curTask.includes('input')) {
        const eformlist = curNodeData[0].eformlist
        const newObjData: any = reqFieldData

        console.log('check require field')

        const requireForm = eformlist.filter((elem: any) => {
          return elem.privilege == 'modify'
        })

        for (const item of requireForm) {
          const eformName = eformData.find((ef: any) => {
            return ef.form_id == item.formid
          }).form_name

          const newData: any = {
            formId: item.formid,
            formName: eformName,
            requireField: []
          }

          // console.log('newData')
          // console.log(newData)

          // console.log('--------------')
          // console.log(`formid : ${item.formid}`)
          // console.log(item.require_field)
          // console.log('--------------')

          const require_field: any = item.require_field

          for (const elem of require_field) {
            if (elem.field !== 'checkbox' && elem.field !== 'radio') {
              const field = document.getElementById(elem.id) as HTMLInputElement

              if (field) {
                if (field.value === '') {
                  inputPass = false
                  const fieldLabel = document.querySelector("[for='" + elem.id + "']") as HTMLLabelElement

                  // sg here

                  // console.log('----- start field not value ----')
                  // console.log(`formId : ${item.formid}`)
                  // console.log(`formName : ${eformName}`)
                  // console.log(`fieldName : ${fieldLabel.textContent}`)
                  // console.log(`fieldId : ${elem.id}`)
                  // console.log('----- end field not value ----')

                  newData.requireField.push({
                    fieldId: elem.id,
                    fieldName: fieldLabel.textContent
                  })

                  field?.classList.add('border-red-500')
                  field?.classList.add('error')
                } else {
                  field?.classList.remove('border-red-500')
                  field?.classList.remove('error')
                }
              } else {
                inputPass = false
                console.log('field not found!')

                //return inputPass
              }
            } else {
              // console.log('Code for ---')
              // console.log(elem)

              const field = document.getElementsByName(elem.id)

              // console.log('field')
              // console.log(field)
              // console.log('-------------------')

              const groupValue: any = []
              let groupParent: any

              for (const fieldElem of field) {
                // console.log('--')
                // console.log('fieldElem')
                // console.log(fieldElem)

                const selElem: any = fieldElem

                // console.log(selElem.value)
                // console.log(selElem.checked)
                // console.log('--')

                groupParent = fieldElem?.parentElement?.parentElement

                if (!selElem.checked) {
                  inputPass = false
                  fieldElem?.parentElement?.parentElement?.classList.add('border-red-500')
                  fieldElem?.parentElement?.parentElement?.classList.add('error')
                }

                groupValue.push(selElem.checked)
              }

              if (groupValue.includes(false)) {
                newData.requireField.push({
                  fieldId: elem.id,
                  fieldName: elem.label
                })
              }

              if (groupValue.includes(true)) {
                inputPass = true
                groupParent?.classList.remove('error')
                groupParent?.classList.remove('border-red-500')
              }
            }
          }

          newObjData.push(newData)
        }

        setReqFieldData(newObjData)

        //inputPass = false // sg stop here for dev
      }
    }

    if (!inputPass) {
      // sg working here
      setDialogTitle('กรุณากรอกข้อมูลให้ครบถ้วน')
      setDialogMsg('requireField')
      console.log('reqFieldData')
      console.log(reqFieldData)

      if (reqFieldData.length > 0) {
        // const firstReqForm: any = reqFieldData[0]

        let formId: any = ''

        if (curTab == 'forms') {
          for (let i = 0; i < reqFieldData.length; i++) {
            console.log('reqFieldData[' + i + ']')
            console.log(reqFieldData[i])
            const elem: any = reqFieldData[i]

            console.log('elem.requireField')
            console.log(elem.requireField)

            if (elem.requireField.length != 0 && formId === '') {
              formId = elem.formId
            }
          }

          const firstReqFieldId = document.body.getElementsByClassName('error')[0].id

          setFirstReqField(firstReqFieldId)
        }

        setExpanded('panel-' + formId)
      }

      handleOpenDialog()
    } else {
      setReqFieldData([])
      setValue('2')
    }

    console.log('-----end handleTask-------')

    return inputPass
  }

  const handleDocument = async () => {
    console.log('-----start handleDocument-------')

    let documentPass = true

    // console.log('attachment ---')
    // console.log(attachment)

    if (documentList) {
      const elemCheck = []

      for (const item of documentList) {
        //console.log('Check ' + item.action + ' สำหรับ ' + item.document_name + `(${item._id})`)
        const docElem = attachment.find((elem: any) => elem.refid == item._id && elem.attachname !== '')

        if (docElem) {
          elemCheck.push('true')
        } else {
          elemCheck.push('false')
        }
      }

      // console.log('elemCheck ===')
      // console.log(elemCheck)

      if (elemCheck.includes('false')) {
        documentPass = false
      } else {
        documentPass = true
      }
    }

    if (!documentPass) {
      setDialogTitle('กรุณาทำรายการเอกสาร (Documents) ให้ครบถ้วน')
      setDialogMsg('ไม่สามารถดำเนินการได้ กรุณาทำรายการเอกสารให้ครบถ้วน')
      handleOpenDialog()
    }

    console.log('-----end handleDocument-------')

    return documentPass
  }

  const handleEditAndSendWork = async () => {
    setValue('1') // !IMPORTANT not edit this line
    handleEditwork().then(() => {
      handleTask().then(inputRes => {
        if (inputRes) {
          handleDocument().then(docRes => {
            if (docRes) {
              handleDecision().then(() => {
                handleNotificateion().then((r: any) => {
                  if (r) {
                    handlesendwork()
                  }
                })
              })
            }
          })
        }
      })
    })
  }

  // console.log('---conditionData')
  // console.log(conditionData)

  const handlesendwork = async () => {
    if (conditionData.length > 1) {
      setDialogTitle('RouteFlow')
      setDialogMsg('ไม่สามารถดำเนินการได้ พบเส้นทางมากกว่า 1 เส้นทาง กรุณาติดต่อผู้ดูแลระบบ')

      handleOpenDialog()
      conditionData = rolbackConditiondata

      return
    }

    if (conditionData.length == 0 || !conditionData) {
      setDialogTitle('RouteFlow')
      setDialogMsg('ไม่พบเส้นทางเดินเอกสาร กรุณาติดต่อผู้ดูแลระบบ')
      handleOpenDialog()
      conditionData = rolbackConditiondata

      return
    }

    try {
      const reqBody = {
        wid: workData.wid,
        uid: conditionData[0].userid,
        dep: conditionData[0].basketId[0],
        rid: workData.workflowid,
        pid: conditionData[0].blockId,
        dateexp: workData.Expiredate,
        senderdep: workData.curdep,
        senderpid: workData.blockid,
        senderuid: workData.curuid
      }

      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/work/send`, reqBody)

      if (response.data.message === 'success') {
        console.log('---Call sendwork success.------------------')
      } else {
        console.log(response.data.message)
      }

      const path = `${process.env.NEXT_PUBLIC_APP_BASEPATH_URL}/${locale}/todo`

      window.location.href = path //navigate(path)
    } catch (error: any) {
      console.log('sendwork failed. ', error.message)
    }
  }

  const handlesendbackwork = async () => {
    try {
      const reqBody = {
        wid: workData.wid,
        uid: workData.curuid,
        dep: workData.curdep,
        pid: workData.blockid,
        rid: workData.workflowid,
        senderpid: workData.senderpid,
        senderuid: workData.senderuid
      }

      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/work/sendback`, reqBody)

      if (response.data.message === 'success') {
        console.log('---Call sendbackwork success.------------------')
      } else {
        console.log(response.data.message)
      }

      const path = `/${locale}/todo`

      window.location.href = path //navigate(path)
    } catch (error: any) {
      console.log('sendbackwork failed. ', error.message)
    }
  }

  const handlerejectwork = async () => {
    try {
      const reqBody = {
        wid: workData.wid,
        rid: workData.workflowid,
        blockid: workData.blockid
      }

      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/work/reject`, reqBody)

      if (response.data.message === 'success') {
        console.log('---Call reject success.------------------')
      } else {
        console.log(response.data.message)
      }

      const path = `/${locale}/todo`

      window.location.href = path //navigate(path)
    } catch (error: any) {
      console.log('reject failed. ', error.message)
    }
  }

  const handleEndWork = async () => {
    try {
      const reqBody = {
        wid: workData.wid,
        rid: workData.workflowid,
        blockid: workData.blockid
      }

      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/work/end`, reqBody)

      if (response.data.message === 'success') {
        console.log('---Call end success.------------------')
      } else {
        console.log(response.data.message)
      }

      const path = `/${locale}/todo`

      window.location.href = path //navigate(path)
    } catch (error: any) {
      console.log('reject failed. ', error.message)
    }
  }

  const expandIcon = (value: string) => <i className={expanded === value ? 'tabler-minus' : 'tabler-plus'} />

  const getAvatar = (params: Pick<any, 'avatar' | 'fullName' | 'email'>) => {
    const { avatar, fullName, email } = params

    if (avatar) {
      return (
        <Tooltip title='View profile'>
          <CustomAvatar
            src={avatar}
            size={55}
            variant='rounded'
            className='cursor-pointer'
            onClick={() => router.push(`/en/users/profile/${email}`)}
          />
        </Tooltip>
      )
    } else {
      return (
        <Tooltip title='View profile'>
          <CustomAvatar size={55} className='cursor-pointer' variant='rounded'>
            {getInitials(fullName as string)}
          </CustomAvatar>
        </Tooltip>
      )
    }
  }

  //handleEndWork

  const formatshortdate = (date: any) => {
    const m_th_names = [
      'ม.ค.',
      'ก.พ.',
      'มี.ค.',
      'เม.ย.',
      'พ.ค.',
      'มิ.ย.',
      'ก.ค.',
      'ส.ค.',
      'ก.ย.',
      'ต.ค.',
      'พ.ย',
      'ธ.ค.'
    ]

    const m_en_names = ['Jan', 'Feb', 'Mar', ' Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

    const d = new Date(date),
      curr_date = d.getDate(),
      curr_month = d.getMonth(),
      curr_year: number = d.getFullYear() + 543

    const formattedDate = d.toLocaleString()
    const curr_time = formattedDate.split(',')[1]

    if (locale == 'th' || locale == 'en') {
      return curr_date + ' ' + m_th_names[curr_month] + ' ' + curr_year + ' ' + curr_time
    }

    return curr_date + ' ' + m_en_names[curr_month] + ' ' + curr_year + ' ' + curr_time
  }

  const checkRequireField = async () => {
    const eformlist = curNodeData[0].eformlist

    const requireForm = eformlist.filter((elem: any) => {
      return elem.privilege == 'modify'
    })

    if (requireForm[0]) {
      if (requireForm[0].formid) {
        // sg bug here
        setExpanded('panel-' + requireForm[0].formid)
      }
    } else {
      //TODO expand first panel
    }

    if (conditionData[0] !== 'null' && conditionData[0] !== 'end-process' && workData.action == '') {
      for (const item of requireForm) {
        const require_field: any = item.require_field

        // console.log('item of requireForm')
        // console.log(item)

        // console.log(item.formid) // sg working here

        for (const elem of require_field) {
          const field = document.getElementById(elem.id) as HTMLInputElement

          if (field) {
            if (field.value === '') {
              field?.classList.add('border-red-500')
              field?.classList.add('error')
            } else {
              field?.classList.remove('border-red-500')
              field?.classList.remove('error')
            }
          }
        }
      }
    }
  }

  return (
    <>
      <TabContext value={value}>
        <Card variant='outlined'>
          <CardContent className='flex p-4 pb-0 gap-2 item-stretch flex-col'>
            <Grid className='flex flex-col gap-0'>
              <Grid className=' flex lg:flex-row sm:flex-col md:flex-col gap-4'>
                <Grid className='md:flex-1 flex gap-4'>
                  <div className='flex rounded-bs-md item-start border-backgroundPaper bg-backgroundPaper'>
                    {workData &&
                      workData?.usercreateinfo[0] &&
                      getAvatar({
                        avatar: workData?.usercreateinfo[0].avatar,
                        fullName: workData?.usercreateinfo[0].firstname + ' ' + workData?.usercreateinfo[0].lastname,
                        email: workData?.usercreateinfo[0].email
                      })}
                  </div>
                  <div className='flex flex-1 flex flex-col items-start justify-start'>
                    <Typography className='text-xs'>Request by:</Typography>
                    <Typography className='font-semibold text-slate-900'>
                      {workData?.usercreateinfo[0].firstname + ' ' + workData?.usercreateinfo[0].lastname}
                    </Typography>
                    <Chip
                      color='primary'
                      variant='tonal'
                      label={
                        activity[0] && `${activity[0].actions[0].depname} / ${activity[0].actions[0].positionname}`
                      }
                      size='small'
                    />
                    <Typography className='text-xs mt-2'>Work ID:</Typography>
                    <Typography className='font-semibold text-slate-900'>{workData.wid}</Typography>
                  </div>
                </Grid>
                <Grid className='md:flex-1 '>
                  {/* <div className='border-solid border-2 border-amber-400'> */}
                  <Typography className='text-xs'>Create Date:</Typography>
                  <Typography className='font-semibold text-slate-900'>
                    {formatshortdate(workData?.Registerdate)}
                  </Typography>
                  <Typography className='text-xs mt-8'>Recieved Date :</Typography>
                  <Typography className='font-semibold text-slate-900 text-left'>
                    {formatshortdate(workData.datein)}
                  </Typography>
                  {/* </div> */}
                </Grid>
                <Grid className=' w-59 '>
                  <div className='flex-none w-59 flex flex-col'>
                    <div className='flex flex-row'>
                      <Typography color='text.disabled' sx={{ paddingRight: 4 }}>
                        Work progress
                      </Typography>
                      <Typography className='font-semibold text-slate-900'>50%</Typography>
                    </div>
                    <LinearProgress value={50} variant='determinate' color='success' className='mt-2 mr-2 min-bs-1' />
                  </div>
                </Grid>
              </Grid>
              <Grid className='flex gap-4 '>
                <div className='flex-none w-14'></div>
                <div className='flex-1'>
                  <Typography className='text-xs mt-2'>Subject :</Typography>
                  <Typography className='flex-1 font-semibold text-slate-900 text-left'>{workData.subject}</Typography>
                  <div>
                    <Typography color='text.primary' className='font-xs text-slate-400'>
                      {workData.routename}
                    </Typography>
                  </div>
                </div>
              </Grid>
            </Grid>

            <Grid className='flex flex-1'>
              <Box sx={{ width: '100%', typography: 'body1' }}>
                <Box>
                  <TabList onChange={handleChange} aria-label='Work tab list'>
                    <Tab
                      label={
                        <div id='eform-tab' className='flex items-center gap-1.5 font-semibold '>
                          {reqStatus ? (
                            <Badge
                              color='error'
                              className='cursor-pointer'
                              variant='dot'
                              overlap='circular'
                              sx={{
                                '& .MuiBadge-dot': {
                                  top: 6,
                                  right: -3,
                                  boxShadow: 'var(--mui-palette-background-paper) 0px 0px 0px 2px'
                                }
                              }}
                              anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                            >
                              <i className='tabler-article text-lg mr-1' />
                              Forms
                            </Badge>
                          ) : (
                            <>
                              <i className='tabler-article text-lg mr-1' />
                              Forms
                            </>
                          )}
                        </div>
                      }
                      onClick={() => setCurTab('forms')}
                      value='1'
                    />
                    <Tab
                      label={
                        <div className='flex items-center gap-1.5 font-semibold'>
                          {documentProperties?.length > 0 ? (
                            <Badge
                              color='error'
                              className='cursor-pointer'
                              variant='dot'
                              overlap='circular'
                              sx={{
                                '& .MuiBadge-dot': {
                                  top: 6,
                                  right: -3,
                                  boxShadow: 'var(--mui-palette-background-paper) 0px 0px 0px 2px'
                                }
                              }}
                              anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                            >
                              <i className='tabler-paperclip text-lg mr-1' />
                              Documents
                            </Badge>
                          ) : (
                            <>
                              <i className='tabler-paperclip text-lg mr-1' />
                              Documents
                            </>
                          )}
                        </div>
                      }
                      onClick={() => setCurTab('documents')}
                      value='2'
                    />
                    <Tab
                      label={
                        <div className='flex items-center gap-1.5 font-semibold'>
                          <i className='tabler-chart-bar text-lg' />
                          Activity
                        </div>
                      }
                      onClick={() => setCurTab('activity')}
                      value='3'
                    />
                  </TabList>
                </Box>
              </Box>
            </Grid>
          </CardContent>
        </Card>
        <Card variant='outlined'>
          <CardContent className='gap-6 p-0'>
            <TabPanel value='1'>
              {eformData.map((form: any, index: any) => {
                return (
                  <Accordion
                    key={index}
                    expanded={expanded === `panel-${form.form_id}`}
                    onChange={handleAccordionChange(`panel-${form.form_id}`)}
                  >
                    <AccordionSummary
                      id={`customized-panel-header-${form.form_id}`}
                      expandIcon={expandIcon('panel1')}
                      aria-controls='customized-panel-content-1'
                    >
                      <Typography className='text-slate-900'>{form.form_name}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <div id={form.form_id}>
                        <div id={`fb-render-${form.Id}`}>Loading...</div>
                      </div>
                      {/* <div id={`fb-render-${form.form_id}`}>Loading...</div> */}
                    </AccordionDetails>
                  </Accordion>
                )
              })}
              <Script
                src={`${basepath}/script/test-render.js`}
                strategy='lazyOnload'
                onReady={() => {
                  console.log('form render has loaded')
                  formRenderV2(eformData, handleEditwork, conditionData, workData?.action)
                }}
              />
            </TabPanel>
            <TabPanel value='2'>
              <DocumentListTable
                docData={documentData} //documentList={documentList}
                handleCheckDocument={handleCheckDocument}
                attachment={attachment} //setAttachment={setAttachment}
              />
            </TabPanel>
            <TabPanel value='3'>
              <Card>
                <CardHeader title='Work Activity Timeline' />
                <CardContent>
                  <Timeline position='alternate'>
                    {activity.map((item: any, index: any) => {
                      return (
                        <TimelineItem key={index}>
                          <TimelineOppositeContent>
                            <Typography variant='caption' component='div' className='mbs-0'>
                              {formatshortdate(item.actions[0].Date)}
                            </Typography>
                          </TimelineOppositeContent>
                          <TimelineSeparator>
                            <TimelineDot color='primary' />
                            <TimelineConnector />
                          </TimelineSeparator>
                          <TimelineContent>
                            <Card>
                              <CardContent>
                                <Typography variant='h5' className='mbe-4 text-left'>
                                  {/* {item.blockId} */}
                                  {item.actions[0].processname}
                                </Typography>

                                {item.actions.map((act: any, ind: any) => {
                                  let curUser = ''

                                  if (ind !== 0) {
                                    curUser = act.user
                                  }

                                  return (
                                    <div key={ind} className='flex gap-5 flex-col'>
                                      {curUser !== act.user && (
                                        <div className='flex items-center gap-2.5'>
                                          <CustomAvatar src={act.avatar} size={32} />
                                          <div className='flex flex-col flex-wrap '>
                                            <Typography variant='body2' className='font-medium'>
                                              {act.name}
                                            </Typography>
                                            <Typography variant='body2' className='text-left'>
                                              {act.depname} / {act.positionname}
                                            </Typography>
                                          </div>
                                        </div>
                                      )}

                                      <div className='flex flex-wrap items-center justify-between gap-x-2 mbe-2.5'>
                                        <Typography className='font-medium' color='text.primary'>
                                          {act.detail}
                                        </Typography>
                                        <Typography variant='caption' color='text.disabled'>
                                          {formatshortdate(act.Date)}
                                        </Typography>
                                      </div>
                                    </div>
                                  )
                                })}
                              </CardContent>
                            </Card>
                          </TimelineContent>
                        </TimelineItem>
                      )
                    })}
                  </Timeline>
                </CardContent>
              </Card>
            </TabPanel>
          </CardContent>
        </Card>
      </TabContext>
      <footer
        className='w-full content-center'
        style={{ color: 'gray', position: 'fixed', bottom: 0, left: 0, textAlign: 'center' }}
      >
        <Card>
          <CardActions
            disableSpacing
            sx={{
              alignSelf: 'stretch',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'flex-start',
              p: 2
            }}
          >
            {workData.blockid !== 'startpoint' &&
              conditionData[0] !== 'end-process' &&
              conditionData[0] !== 'null' &&
              workData.action == '' && (
                <Button variant='contained' onClick={() => handlesendbackwork()} className='mr-2' type='submit'>
                  Send Back
                </Button>
              )}

            {conditionData[0] !== 'null' && conditionData[0] !== 'end-process' && workData.action == '' && (
              <>
                <Button
                  variant='contained'
                  onClick={() => handleEditwork()}
                  className='mr-2'
                  color='info'
                  type='submit'
                >
                  Save
                </Button>

                {/* <Button variant='contained' onClick={() => handleEditAndSendWork()} className='mr-2' type='submit'>
                  Finish
                </Button> */}
              </>
            )}

            {conditionData[0] !== 'end-process' &&
              conditionData[0] !== 'null' &&
              workData.action == '' &&
              workData.blockid !== 'startpoint' && (
                <Button
                  variant='contained'
                  color='info'
                  onClick={() => handlerejectwork()}
                  className='mr-2'
                  type='submit'
                >
                  Reject
                </Button>
              )}

            {conditionData[0] !== 'end-process' &&
              conditionData[0] !== 'null' &&
              workData.action == '' &&
              workData.blockid !== 'startpoint' && (
                <Button variant='contained' onClick={() => handleEditAndSendWork()} className='mr-2' type='submit'>
                  Approve
                </Button>
              )}

            {conditionData[0] !== 'end-process' &&
              conditionData[0] !== 'null' &&
              workData.action == '' &&
              workData.blockid == 'startpoint' && (
                <Button variant='contained' onClick={() => handleEditAndSendWork()} className='mr-2' type='submit'>
                  Send
                </Button>
              )}

            {conditionData[0] === 'end-process' && workData.action == '' && (
              <>
                <Button variant='contained' onClick={() => handlesendbackwork()} className='mr-2' type='submit'>
                  Send Back
                </Button>

                <Button
                  variant='contained'
                  color='info'
                  onClick={() => handlerejectwork()}
                  className='mr-2'
                  type='submit'
                >
                  Reject
                </Button>

                <Button variant='contained' onClick={() => handleEndWork()} className='mr-2' type='submit'>
                  End Finish
                </Button>
              </>
            )}

            {/* {conditionData === 'end-process' && workData.action == '' && (

            )} */}

            {/* <Link href={'/en/todo'}>

            </Link> */}
            <Button variant='contained' color='inherit' onClick={() => router.back()}>
              close
            </Button>
          </CardActions>
        </Card>
      </footer>

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle className='text-center pb-0' id='alert-dialog-title'>
          <i className='tabler-alert-circle mbe-2 text-[96px] text-error' />
          <br />
          {dialogTitle}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            {dialogMsg == 'requireField'
              ? reqFieldData?.map((item: any, index: any) => (
                  <Alert className='mt-2' key={index} severity='error'>
                    <AlertTitle>แบบฟอร์ม : {item.formName}</AlertTitle>
                    {item.requireField?.map((reqItem: any, reqIndex: any) => (
                      <span key={reqIndex}> [{reqItem.fieldName}] </span>
                    ))}
                  </Alert>
                ))
              : dialogMsg}
          </DialogContentText>
        </DialogContent>
        <DialogActions className='dialog-actions-dense'>
          <Button color='error' variant='contained' onClick={handleClose}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
      <ToastContainer />
    </>
  )
}

export default WorkProfile
