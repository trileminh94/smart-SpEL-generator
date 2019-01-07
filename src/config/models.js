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
    name: 'category',
    type: 'text',
    label: 'Category'
  }, {
    name: 'params',
    type: 'json',
    label: 'Params'
  }, {
    name: 'extparams',
    type: 'json',
    label: 'Ext Params'
  }, {
    name: 'clienttype',
    type: 'number',
    label: 'Client Type'
  }, {
    name: 'clientversion',
    type: 'number',
    label: 'Client Version'
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
      case 'category':
        return 'category.getCategory()'
      case 'clienttype':
        return 'logJob.getClientType()'
      case 'clientversion':
        return 'logJob.getClientVersion()'

  }
}