export const is = {
  operator: 'is',
  label: 'is'
}

export const isNot = {
  operator: 'isNot',
  label: 'is not'
}

export const equal = {
  operator: 'equal',
  label: 'equal'
}

export const notEqual = {
  operator: 'notEqual',
  label: 'not equal'
}

export const contains = {
  operator: 'contains',
  label: 'contains'
}

export const notContain = {
  operator: 'notContain',
  label: 'does not contain',
}

export const isBetween = {
  operator: 'isBetween',
  label: 'is between',
  inputs: 2
}

export const isGreaterThan = {
  operator: 'isGreaterThan',
  label: 'is greater than',
}

export const isLessThan = {
  operator: 'isLessThan',
  label: 'is less than',
}

export const beginsWith = {
  operator: 'beginsWith',
  label: 'begins with',
}

export const endsWith = {
  operator: 'endsWith',
  label: 'ends with',
}

export const inLast = {
  operator: 'inLast',
  label: 'in the last',
  type: 'number', // overriding
  unit: 'days'
}

export const notInLast = {
  operator: 'notInLast',
  label: 'not in the last',
  type: 'number', // overriding
  unit: 'days'
}

export const isNotEmpty = {
  operator: 'notEmpty',
  label: 'not empty'
}

export const isEmpty = {
  operator: 'empty',
  label: 'empty'
}

export const hasField = {
  operator: 'hasField',
  label: 'has field'
}

export const notHasField = {
  operator: 'notHasField',
  label: "doesn't has field"
}

export default [
  is,
  isNot,
  equal,
  notEqual,
  contains,
  notContain,
  isBetween,
  isGreaterThan,
  isLessThan,
  beginsWith,
  endsWith,
  inLast,
  notInLast,
  isEmpty,
  isNotEmpty,
  hasField,
  notHasField
]