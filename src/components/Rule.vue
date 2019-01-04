<template>
  <div class="row rule" style="border-left: 1px solid #aaa;">
    <div style="display: inline-block; vertical-align: top; margin-left: -23px;">
      <button @click.prevent="removeRule">&times;</button>
    </div>
    <div v-if="operatorType === null" class="inline">
      <button @click.prevent="addSimple">+ Simple Rule</button>
      <button @click.prevent="addBin">+ BinOp</button>
      <button @click.prevent="addUna">+ UnaryOp</button>
      <Alert v-if="!isValid" />
    </div>
    <div v-else-if="operatorType === 'unary'" class="inline">
      <select v-on:change="onInput" v-model="operator">
        <option v-for="una in operators" :value="una" :key="una.operator">{{ una.label }}</option>
      </select>
      <button v-if="canAddSubRule" @click.prevent="addSubRule">+ SubRule</button>
      <Alert v-if="!isValid" />
      <Rule 
        v-for="rule in this.mutatedRule.subrules"
        :key="rule.id"
        :rule="rule"
        @input="onRuleChanged"
        @remove="remove(rule)"
      />
    </div>
    <div v-else-if="operatorType === 'binary'" class="inline">
      <select v-on:change="onInput" v-model="operator">
        <option v-for="bin in operators" :value="bin" :key="bin.operator">{{ bin.label }}</option>
      </select>
      <button v-if="canAddSubRule" @click.prevent="addSubRule">+ SubRule</button>
      <Alert v-if="!isValid" />
      <Rule 
        v-for="rule in this.mutatedRule.subrules"
        :key="rule.id"
        :rule="rule"
        @input="onRuleChanged"
        @remove="remove(rule)"
      />
    </div>
    <div v-else class="inline">
      <select v-on:change="onInput" v-model="selectedModel">
        <option v-for="model in models" :key="model.name" :value="model">{{ model.label }}</option>
      </select>
      <select v-on:change="onInput" v-model="operator">
        <option v-for="option in simpleOperatorOptions" :value="option" :key="option.operator">{{ option.label }}</option>
      </select>
      <rule-input
        v-for="input in availableInputs"
        :key="input.id"
        :type="operator.type || selectedModel.type"
        v-model="input.value"
        @input="onInput"
      />
      <Alert v-if="!isValid" />
    </div>
  </div>
</template>

<script>
import models from '../config/models'
import types from '../config/types'
import binOp from '../config/binop'
import unaOp from '../config/unaop'
import operators from '../config/operators'

export default {
  name: 'rule',
  components: {
    RuleInput: () => import('./RuleInput'),
    Rule: () => import('./Rule'),
    Alert: () => import('./Alert')
  },

  props: ['rule'],

  data: () => ({
    models,
    binOp: binOp,
    unaOp: unaOp,
    isLeaf: false,
    operator: null,
    operatorType: null,
    selectedModel: null,
    inputValues: [],
    mutatedRule: {},
  }),

  watch: {
    simpleOperatorOptions () {
      if (this.selectedModel === this.mutatedRule.model) {
        this.operator = this.simpleOperatorOptions.find(o => o.operator === this.mutatedRule.operator)
      } else {
        this.operator = this.simpleOperatorOptions[0]
      }
    },

    operators () {
      this.operator = this.getOperator(this.operatorType, this.mutatedRule.operator)
    },

    mutatedRule () {
      this.$forceUpdate()
    }
  },

  computed: {
    simpleOperatorOptions () {
      return this.selectedModel ? types[this.selectedModel.type] : []
    },

    operators () {
      if (this.operatorType === 'unary') {
        return this.unaOp
      } else if (this.operatorType === 'binary') {
        return this.binOp
      }
      return []
    },

    isValid () {
      if (this.operatorType === 'unary') {
        return this.mutatedRule.subrules.length === 1
      } else if (this.operatorType === 'binary') {
        return this.mutatedRule.subrules.length === 2
      } else if (this.operatorType === 'simple') {
        return true
      }
      return false
    },

    availableInputs () {
      if (!this.operator) {
        return []
      }

      const inputs = []

      for (let i = 0, inputCount =  this.operator.inputs || 1; i < inputCount; ++i) {
        inputs.push({
          id: `${this.mutatedRule.model.name}_${this.operator.operator}_${i}`,
          value: this.isOriginalOperatorSelected ? this.mutatedRule.value[i] : ''
        })
      }

      return inputs
    },

    isOriginalOperatorSelected () {
      return this.selectedModel === this.mutatedRule.model &&
        this.operator.operator === this.mutatedRule.operator
    },

    canAddSubRule () {
      return (this.operatorType === 'binary' && this.mutatedRule.subrules.length < 2) 
        || (this.operatorType === 'unary' && this.mutatedRule.subrules.length < 1)
    }
  },

  created () {
    this.mutatedRule = Object.assign({}, this.rule)
    this.mutatedRule.model = this.selectedModel = this.models.find(m => m.name === this.mutatedRule.model)
    this.operatorType = this.rule.operatorType
    this.operator = this.getOperator(this.operatorType, this.mutatedRule.operator)
  },

  methods: {
    getOperator (operatorType, operator) {
      var result = null
      if (operator !== null && operator !== undefined) {
        if (operatorType === "unary") {
          result = unaOp.find(o => o.operator === operator)
        } else if (operatorType === "binary") {
          result = binOp.find(o => o.operator === operator)
        } else if (operatorType === "simple") {
          result = this.simpleOperatorOptions.find(o => o.operator === operator)
        }
      } else {
        if (operatorType === "unary") {
          result = unaOp[0]
        } else if (operatorType === "binary") {
          result = binOp[0]
        } else if (operatorType === "simple") {
          result = this.simpleOperatorOptions.find(o => o.operator === operator)
        }
      }
      // eslint-disable-next-line
      console.log("get ", operatorType, operator, result)
      return result
    },

    onInput () {
      this.$emit('input', {
        id: this.mutatedRule.id,
        model: this.selectedModel.name,
        operator: this.operator.operator,
        value: this.availableInputs.map(input => input.value),
        subrules: this.mutatedRule.subrules,
        operatorType: this.operatorType,
        isLeaf: this.isLeaf
      })
    },

    notifyUpdateSubRule () {
      this.onInput()
    },

    remove (rule) {
      this.mutatedRule.subrules = this.mutatedRule.subrules.filter(r => r.id !== rule.id)
      this.notifyUpdateSubRule()
    },

    onRuleChanged (rule) {
      let ruleChage = this.mutatedRule.subrules.find(r => r.id === rule.id)
      Object.assign(ruleChage, rule)
    },

    removeRule () {
      this.$emit('remove')
    },

    addBin () {
      this.operatorType = 'binary'
      this.notifyUpdateSubRule()
    },

    addUna () {
      this.operatorType = 'unary'
      this.notifyUpdateSubRule()
    },

    addSimple () {
      this.operatorType = 'simple'
      this.isLeaf = true
      this.notifyUpdateSubRule()
    },

    addSubRule () {
      this.mutatedRule.subrules.push(this.createNewRule())
    },

    createNewRule () {
      var time = (new Date).getTime() + Math.round(Math.random() * 10)
      return {
        id: time,
        isLeaf: false,
        operatorType: null,
        model: models[0].name,
        operator: operators[0].operator,
        subrules: [],
        value: []
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.row {
  display: block;
  padding-bottom: 8px;
}

.inline {
  display: inline-block;
}

.rule {
  vertical-align: text-top;
  padding: 8px;
  padding-left: 10px;
}

</style>
