import {
    is,
    isNot,
    contains,
    notContain,
    beginsWith,
    endsWith,
    isBetween,
    isGreaterThan,
    isLessThan,
    notEqual,
    equal,
    hasField,
    notHasField
  } from './operators'

import { getModel } from './models'

export const genCode = (root) => {
    if ( root === null || !checkValid(root)) {
        return "";
    }
    var model = root.model;
    var operatorType = root.operatorType;
    var operator = root.operator;
    var value = root.value;
    if (operatorType === 'simple') {
        return processTree(model, operatorType, operator, value);
    } else {
        if (operatorType === 'binary') {
            var left = genCode(root.subrules[0]);
            var right = genCode(root.subrules[1]);
            var binop = processTree(model, operatorType, operator, value);
            var simpleResult = left + " " + binop + " " + right
            for (var i = 2; i < root.subrules.length; i++) {
                simpleResult = simpleResult + " " + binop + " " + genCode(root.subrules[i])
            }
            return "(" + simpleResult + ")";
        } else if (operatorType === 'unary') {
            var tree = genCode(root.subrules[0])
            var unaop = processTree(model, operatorType, operator, value);
            return unaop + "(" + tree + ")";
        }  
    }
}

function checkValid(root) {
    var operatorType = root.operatorType;
    if (operatorType === 'simple') {
        return root.value.length >= 1 && root.value[0] !== ''
    } else {
        if (operatorType === 'binary') {
            if (root.subrules.length >= 2) {
                var c1 = checkValid(root.subrules[0])
                var c2 = checkValid(root.subrules[1])
                var result = c1 && c2
                for (var i = 2; i < root.subrules.length; i++) {
                    result = result && checkValid(root.subrules[i])
                }
                return result
            }
            return false
        } else if (operatorType === 'unary') {
            if (root.subrules.length === 1) {
                return checkValid(root.subrules[0])
            }
            return false
        }  
    }
}

function processTree(model, operatorType, operator, value) {
    var resData = '';
    if (operatorType === 'binary') {
        if (operator === 'and') {
            resData = '&&'
        }
        if (operator === 'or') {
            resData = '||'
        }
    }

    if (operatorType === 'unary') {
        if (operator === 'not') {
            resData = '!'
        }
    }

    if (operatorType === 'simple') {
        var modelResult = getModel(model)
        if (operator === is.operator) {
            resData = modelResult + '==' + value[0] ;
        }

        if (operator === isNot.operator) {
            resData = modelResult + '!=' + value[0] ;
        }

        if (operator === equal.operator) {
            resData = modelResult + '=="' + value[0] + '"'
        }

        if (operator === notEqual.operator) {
            resData = modelResult + '!="' + value[0] + '"'
        }

        if (operator === contains.operator) {
            resData = modelResult + '.contains' + '("' + value + '")';
        }

        if (operator === notContain.operator) {
            resData = modelResult + '.notContains' + '("' + value + '")';
        }

        if (operator === beginsWith.operator) {
            resData = modelResult + '.beginWith' + '(' + value + ')';
        }

        if (operator === endsWith.operator) {
            resData = modelResult + '.endWith' + '(' + value + ')';
        }

        if (operator === isBetween.operator) {
            resData = '(' + modelResult + ' > ' + value[0] + ' && ' + modelResult + ' < ' + value[1] + ')'
        }

        if (operator === isLessThan.operator) {
            resData = modelResult + '<' + value[0]
        }

        if (operator === isGreaterThan.operator) {
            resData = modelResult + '>' + value[0]
        }

        if (operator === hasField.operator) {
            resData = "(#jsonPath(" + modelResult + ",'$.[?(@." + value[0] + ")]').size() > 0)"
        }

        if (operator === notHasField.operator) {
            resData = "!(#jsonPath(" + modelResult + ",'$.[?(@." + value[0] + ")]').size() > 0)"
        }
    }
    return resData;
}