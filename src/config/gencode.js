export const genCode = (root) => {
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
            return "( " + left + " " + binop + " " + right + " )";
        } else if (operatorType === 'unary') {
            var tree = genCode(root.subrules[0])
            var unaop = processTree(model, operatorType, operator, value);
            return unaop + "( " + tree + " )";
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
        if (operator === 'is') {
            resData = model + '==' + value ;
        }

        if (operator === 'contains') {
            resData = model + '.contains' + '(' + value + ')';
        }

        if (operator === 'beginWith') {
            resData = model + '.beginWith' + '(' + value + ')';
        }
    }
    return resData;
}