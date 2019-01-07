export default [
  {
    name: 'cmd',
    type: 'cmd',
    label: 'Cmd'
  }, {
    name: 'subcmd',
    type: 'number',
    label: 'Sub Cmd'
  }, {
    name: 'result',
    type: 'number',
    label: 'Result'
  }, {
    name: 'params',
    type: 'json',
    label: 'Params'
  }, {
    name: 'extparams',
    type: 'json',
    label: 'Ext Params'
  }, {
    name: 'ip',
    type: 'text',
    label: 'Server Ip'
  }
]

export const getModel = (model) => {
  switch(model) {
      case 'cmd':
          return 'logJob.getCommand()'
      case 'subcmd':
          return 'logJob.getSubCommand()'
      case 'result':
        return 'logJob.getResult()'
      case 'params':
        return 'logJob.getParam()'
      case 'extparams':
        return 'logJob.getExtParam()'
  }
}