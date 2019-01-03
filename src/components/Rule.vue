<template>
  <div class="row rule">
    <div style="display: inline-block; vertical-align: top;">
      <button @click.prevent="removeRule">&times;</button>
    </div>
    <div v-if="operatorType === null" class="inline">
      <button @click.prevent="addBin">Add BinOp</button>
      <button @click.prevent="addUna">Add UnaryOp</button>
      <button @click.prevent="addSimple">Add SimpleRule</button>
    </div>
    <div v-else-if="operatorType === 'unary'" class="inline">
      <select v-model="operator">
        <option v-for="una in operators" :value="una" :key="una.operator">{{ una.label }}</option>
      </select>
      <button @click.prevent="addSubRule">+ SubRule</button>
      <button @click.prevent="cancel">Cancel</button>
      <Rule 
        v-for="rule in this.mutatedRule.subrules"
        :key="rule.id"
        :rule="rule"
        @input="onRuleChanged"
        @remove="remove(rule)"
      />
    </div>
    <div v-else-if="operatorType === 'binary'" class="inline">
      <select v-model="operator">
        <option v-for="bin in operators" :value="bin" :key="bin.operator">{{ bin.label }}</option>
      </select>
      <button @click.prevent="addSubRule">+ SubRule</button>
      <button @click.prevent="cancel">Cancel</button>
      <Rule 
        v-for="rule in this.mutatedRule.subrules"
        :key="rule.id"
        :rule="rule"
        @input="onRuleChanged"
        @remove="remove(rule)"
      />
    </div>
    <div v-else class="inline">
      <select v-model="selectedModel">
        <option v-for="model in models" :key="model.name" :value="model">{{ model.label }}</option>
      </select>
      <select v-model="simpleOperator">
        <option v-for="option in simpleOperatorOptions" :value="option" :key="option.operator">{{ option.label }}</option>
      </select>
      <rule-input
        v-for="input in availableInputs"
        :key="input.id"
        :type="simpleOperator.type || selectedModel.type"
        v-model="input.value"
        @input="onInput"
      />
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
    Rule: () => import('./Rule')
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
    simpleOperator: null,
    inputValues: [],
    mutatedRule: {},
  }),

  watch: {
    simpleOperatorOptions () {
      if (this.selectedModel === this.mutatedRule.model) {
        this.simpleOperator = this.simpleOperatorOptions.find(o => o.operator === this.mutatedRule.operator)
      } else {
        this.simpleOperator = this.simpleOperatorOptions[0]
      }
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

    availableInputs () {
      if (!this.simpleOperator) {
        return []
      }

      const inputs = []

      for (let i = 0, inputCount =  this.simpleOperator.inputs || 1; i < inputCount; ++i) {
        inputs.push({
          id: `${this.mutatedRule.model.name}_${this.simpleOperator.operator}_${i}`,
          value: this.isOriginalOperatorSelected ? this.mutatedRule.value[i] : ''
        })
      }

      return inputs
    },

    isOriginalOperatorSelected () {
      return this.selectedModel === this.mutatedRule.model &&
        this.simpleOperator.operator === this.mutatedRule.operator
    }
  },

  created () {
    this.mutatedRule = Object.assign({}, this.rule)
    this.mutatedRule.model = this.selectedModel = this.models.find(m => m.name === this.mutatedRule.model)
    this.operatorType = this.rule.operatorType
    this.simpleOperator = this.operatorType === "simple" ? this.simpleOperatorOptions.find(o => o.operator === this.mutatedRule.operator) : ''
    this.operator = (() => { 
      if (this.operatorType === "unary") {
        return unaOp[0]
      } else if (this.operatorType === "binary") {
        return binOp[0]
      } else if (this.operatorType === "simple") {
        return this.simpleOperatorOptions.find(o => o.operator === this.mutatedRule.operator)
      } else {
        return null
      }
    })()
  },

  methods: {
    onInput () {
      this.$emit('input', {
        id: this.mutatedRule.id,
        model: this.selectedModel.name,
        operator: this.simpleOperator.operator,
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
      // eslint-disable-next-line
      console.log("call remove ", rule)
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

    cancel () {
      this.operatorType = null
      this.mutatedRule.subrules = []
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
  padding: 5px;
}
</style>
