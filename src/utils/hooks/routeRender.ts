declare const jsPlumb: any //

let numberOfElements = 0
const htmlBase = 'routeContainer'
let flowChart: any
const oldObj = ''
const carrint = 0
const carr: any = []
let connectionPass = false

console.log(oldObj)
console.log(carrint)
console.log(carr)
console.log(connectionPass)

const startData: any = {
  nodes: [
    {
      blockId: 'startpoint',
      processname: 'Start',
      processdsc: 'Start Process...',
      basketid: '',
      userid: '',
      precessexdate: '',
      eformlist: [],
      document_list: [],
      task: ['input'],
      status: 'active',
      nodetype: 'startpoint',
      positionX: 560,
      positionY: 10,
      userlist: [],
      deplev: '',
      positionlev: '',
      forblockid: ''
    }
  ],
  connections: [],
  notifications: [],
  numberOfElements: 0,
  _id: '',
  name: '',
  description: '',
  client_alias: 'kcs',
  eforms: [],
  startdate: '',
  enddate: '',
  status: 'inactive'
}

const first_fid = ''
const first_fname = ''
const first_fdsc = ''
const first_masterRequirefield = ''
const first_sarabanEfromXml = ''
let bind_connection_id = ''
const curNotiData = ''
const processIdArr = ['000']
const curNodeData: any = []
let curNewNodeId: string = '0'

console.log(first_fid)
console.log(first_fname)
console.log(first_fdsc)
console.log(first_masterRequirefield)
console.log(first_sarabanEfromXml)
console.log(bind_connection_id)
console.log(curNotiData)
console.log(processIdArr)
console.log(curNodeData)
console.log(startData)
console.log(curNewNodeId)

const scriptGetProcess = (id: any, name: any) => {
  const d = document.createElement('div')

  $(d).addClass('w process node').attr('id', id).attr('data-nodetype', 'process').attr('style', 'left:30px; top:30px')
  const h = document.createElement('h3')

  $(h).addClass('popover-title')
  const b2 = document.createElement('button')

  $(b2).addClass('pull-right btn btn-rounded btn-xs btn-setting btn-default m-r-xs').attr('type', 'button')
  const i2 = document.createElement('i')

  $(i2).addClass('fa fa-cog btn-setting').appendTo($(b2))
  const b = document.createElement('button')

  $(b).addClass('pull-right button_remove btn btn-rounded btn-xs  btn-default').attr('type', 'button')
  const i = document.createElement('i')

  $(i).addClass('fa fa-times').appendTo($(b))
  $(b).appendTo($(h))
  $(b2).appendTo($(h))

  const d2 = document.createElement('div')

  $(d2).addClass('ep pull-right').appendTo($(h))

  const d3 = document.createElement('div')

  $(d3)
    .attr('style', 'white-space:nowrap; margin-right:80px;text-overflow: ellipsis; overflow:hidden;')
    .attr('class', 'name-pro')
    .html(name)
    .appendTo($(h))
  $(h).appendTo($(d))

  const d4 = document.createElement('div')

  $(d4).addClass('popover-content')

  const d5 = document.createElement('div')

  $(d5).addClass('scrollable process-desc').html('Process Description....').appendTo($(d4))
  $(d4).appendTo($(d))
  $(d).appendTo($('#' + htmlBase))
}

function scriptGetParallel(id: any, name: any) {
  const d = document.createElement('div')

  $(d).addClass('w parallel node').attr('id', id).attr('data-nodetype', 'parallel').attr('style', 'left:30px; top:30px')

  const h = document.createElement('h3')

  $(h).addClass('popover-title')

  const b2 = document.createElement('button')

  $(b2).addClass('pull-right btn btn-rounded btn-xs btn-setting btn-default m-r-xs').attr('type', 'button')

  const i2 = document.createElement('i')

  $(i2).addClass('fa fa-cog btn-setting').appendTo($(b2))

  const b = document.createElement('button')

  $(b).addClass('pull-right button_remove btn btn-rounded btn-xs  btn-default').attr('type', 'button')

  const i = document.createElement('i')

  $(i).addClass('fa fa-times').appendTo($(b))
  $(b).appendTo($(h))
  $(b2).appendTo($(h))

  const d2 = document.createElement('div')

  $(d2).addClass('ep pull-right').appendTo($(h))

  const d3 = document.createElement('div')

  $(d3)
    .attr('style', 'white-space:nowrap; margin-right:80px;text-overflow: ellipsis; overflow:hidden;')
    .attr('class', 'name-pro')
    .html(name)
    .appendTo($(h))
  $(h).appendTo($(d))

  const d4 = document.createElement('div')

  $(d4).addClass('popover-content')

  const d5 = document.createElement('div')

  $(d5).addClass('scrollable process-desc').html('Parallel Description....').appendTo($(d4))
  $(d4).appendTo($(d))
  $(d).appendTo($('#' + htmlBase))
}

const getProcess = (id?: string, name?: string) => {
  processIdArr.push(id || 'processContainer' + numberOfElements++)

  scriptGetProcess(id, name)

  const maxConnections = 10 //const maxConnections = sessionStorage.getItem('connmax') ? parseInt(sessionStorage.getItem('connmax')) : 10 // Default to 10

  const processConnectorStartpoint = {
    filter: '.ep',
    anchor: 'Continuous',
    connector: [
      'StateMachine',
      {
        curviness: 20
      }
    ],
    connectorStyle: {
      // strokeStyle: '#838282',
      strokeStyle: '#f00',
      lineWidth: 2,
      outlineColor: 'transparent',
      outlineWidth: 4
    },
    maxConnections: maxConnections,

    onMaxConnections(info: any) {
      alert(`Maximum connections (${info.maxConnections}) reached`)
    }
  }

  jsPlumb.makeSource($('.process'), processConnectorStartpoint)
  jsPlumb.makeTarget($('.process'), {
    anchor: 'Continuous',
    dropOptions: { hoverClass: 'dragHover' }
  })
  jsPlumb.draggable($('#' + (id || '')))

  return id
}

function getParallel(id: any, name: any) {
  if (typeof id === 'undefined') {
    numberOfElements++
    id = 'processContainer' + numberOfElements
  }

  scriptGetParallel(id, name)

  const processConnectorStartpoint = {
    filter: '.ep', // only supported by jquery
    anchor: 'Continuous',
    connector: [
      'StateMachine',
      {
        // กำหนด Connector แบบ StateMachine
        curviness: 20 // กำหนดความโค้งของเส้น Connector , ถ้ากำหนดค่า = 1 จะเป็นเส้นตรง
      }
    ],
    connectorStyle: {
      strokeStyle: '#838282',
      lineWidth: 2,
      outlineColor: 'transparent',
      outlineWidth: 4
    },
    maxConnections: 10, // กำหนดจำนวนสูงสุดที่เชือมต่อได้
    onMaxConnections: function (info: any, e: any) {
      console.log('e ==')
      console.log(e)

      alert('Maximum connections (' + info.maxConnections + ') reached') // ข้อความแจ้งเตือนหาก เชื่อมต่อเกินกว่าที่กำหนด
    }
  }

  const processConnectorEndpoint = {
    anchor: 'Continuous',
    dropOptions: { hoverClass: 'dragHover' }
  }

  jsPlumb.makeSource($('.parallel'), processConnectorStartpoint)
  jsPlumb.makeTarget($('.parallel'), processConnectorEndpoint)
  jsPlumb.draggable($('#' + id))

  return id
}

function repositionElement(id: any, posX: any, posY: any) {
  $('#' + id).css('left', posX)
  $('#' + id).css('top', posY)

  //jsPlumb.repaint(id)
}

function setnodeProp(id: any, u: any, f: any) {
  $('#' + id).attr('user', u)
  $('#' + id).attr('userfullname', f)
}

function setnodeUserPosition(id: any, posid: any, posname: any) {
  $('#' + id).attr('user_position', posid)
  $('#' + id).attr('user_position_name', posname)
}

function setnodeUserField(id: any, label: any, fieldid: any, formid: any) {
  $('#' + id).attr({ fieldlabel: label, formid: formid, fieldid: fieldid }) //hello
}

const zeroPad = (num: any, places: any) => {
  const zero = places - num.toString().length + 1

  return Array(+(zero > 0 && zero)).join('0') + num
}

async function loadFlowchart() {
  // start draw flowchart

  console.log('load flow chart')

  //sg new routeflow
  const nodes = flowChart.nodes

  console.log('flowChart')
  console.log(flowChart)

  $.each(nodes, function (index, elem) {
    if (elem.nodetype === 'startpoint') {
      repositionElement('startpoint', elem.positionX, elem.positionY)
      $('h3 .name-pro', '#startpoint').html(elem.processname.replace(/&q;/g, "'"))
      $('div .scrollable', '#startpoint').html(elem.processdsc.replace(/&q;/g, "'"))
      $('#txtex').val(elem.precessexdate)
      $('#' + elem.blockId).attr('bid', elem.basketid)
      $('#' + elem.blockId).attr('nodeid', elem._id)
      if (typeof elem.task !== 'undefined') $('#' + elem.blockId).attr('task', JSON.stringify(elem.task))

      if (elem.userid.length > 0) {
        setnodeProp(elem.blockId, elem.userid, elem.user_fullname)
      }

      if (elem.user_field) {
        // $("#userfield-tab").click(); // sg check here
        const userField = JSON.parse(elem.user_field)

        setnodeUserField(elem.blockId, userField.label, userField.fieldid, userField.formid)
      }

      if (typeof elem.user_position != 'undefined' && elem.user_position != '') {
        setnodeUserPosition(elem.blockId, elem.user_position, elem.user_position_name)
      }
    } else if (elem.nodetype === 'endpoint') {
      repositionElement('endpoint', elem.positionX, elem.positionY)

      $('#' + elem.blockId).attr('bid', elem.basketid)
      $('#' + elem.blockId).attr('nodeid', elem._id)
      if (typeof elem.task !== 'undefined') $('#' + elem.blockId).attr('task', JSON.stringify(elem.task))

      if (elem.userid.length > 0) {
        setnodeProp(elem.blockId, elem.userid, elem.user_fullname)
      }

      if (elem.user_field) {
        const userField = JSON.parse(elem.user_field)

        setnodeUserField(elem.blockId, userField.label, userField.fieldid, userField.formid)
      }

      if (typeof elem.user_position != 'undefined' && elem.user_position != '') {
        setnodeUserPosition(elem.blockId, elem.user_position, elem.user_position_name)
      }
    } else if (elem.nodetype === 'process') {
      const id = getProcess(elem.blockId, elem.processname) //sixthgraph rename addprocess

      $('div .scrollable', '#' + elem.blockId).html(elem.processdsc)

      repositionElement(id, elem.positionX, elem.positionY)

      $('#' + elem.blockId).attr('bid', elem.basketid)
      $('#' + elem.blockId).attr('nodeid', elem._id)

      if (typeof elem.task !== 'undefined') $('#' + elem.blockId).attr('task', JSON.stringify(elem.task))

      if (elem.userid.length > 0) {
        setnodeProp(elem.blockId, elem.userid, elem.user_fullname)
      }

      if (elem.user_field) {
        const userField = JSON.parse(elem.user_field)

        setnodeUserField(elem.blockId, userField.label, userField.fieldid, userField.formid)
      }

      if (typeof elem.user_position != 'undefined' && elem.user_position != '') {
        setnodeUserPosition(elem.blockId, elem.user_position, elem.user_position_name)
      }
    } else if (elem.nodetype === 'parallel') {
      const id = getParallel(elem.blockId, elem.processname)

      $('div .scrollable', '#' + elem.blockId).html(elem.processdsc)

      repositionElement(id, elem.positionX, elem.positionY)

      $('#' + elem.blockId).attr('bid', elem.basketid)
      $('#' + elem.blockId).attr('nodeid', elem._id)

      if (typeof elem.task !== 'undefined') $('#' + elem.blockId).attr('task', JSON.stringify(elem.task))

      if (elem.userid.length > 0) {
        setnodeProp(elem.blockId, elem.userid, elem.user_fullname)
      }

      if (elem.user_field) {
        const userField = JSON.parse(elem.user_field)

        setnodeUserField(elem.blockId, userField.label, userField.fieldid, userField.formid)
      }
    }
  })

  const connections = flowChart.connections

  // console.log('load connections ====')
  // console.log(connections)

  $.each(connections, function (index, elem) {
    //TODO : fixed connection.id = elem.connectionId

    bind_connection_id = elem.connectionId

    const connection1 = jsPlumb.connect({
      source: elem.pageSourceId,
      target: elem.pageTargetId,
      anchors: ['BottomCenter', [0.75, 0, 0, -1]]
    })

    connection1.id = elem.connectionId

    // console.log('start check connection1=====')
    // console.log(elem._id)
    // console.log(elem.connectionId + '===' + connection1.id) // sg here2
  })

  numberOfElements = flowChart.numberOfElements
  connectionPass = true
} //loadflowchart

export const routeRender = (workFlowData: any) => {
  console.log('start jsPlumb')
  console.log(workFlowData[0])
  flowChart = workFlowData[0]

  $(document).ready(function () {
    console.log('document .ready')
    loadFlowchart().then(() => {
      // sg new routeflow
      console.log('processIdArr===')
      console.log(processIdArr)

      const newArray: any = [...processIdArr]
      const maxId = Math.max(newArray)

      console.log('maxId ===')
      console.log(maxId)

      curNewNodeId = zeroPad(maxId, 3)
    })
  })
}
