export const genCode = (root) => {
    if (!checkValid(root)) {
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
            return "(" + left + " " + binop + " " + right + ")";
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
        return true
    } else {
        if (operatorType === 'binary') {
            if (root.subrules.length === 2) {
                var c1 = checkValid(root.subrules[0])
                var c2 = checkValid(root.subrules[1])
                return c1 && c2
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
        if (operator === 'is') {
            resData = model + '==' + value ;
        }

        if (operator === 'contains') {
            resData = model + '.contains' + '("' + value + '")';
        }

        if (operator === 'beginWith') {
            resData = model + '.beginWith' + '(' + value + ')';
        }
    }
    return resData;
}