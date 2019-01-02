<template>
  <div class="row">
    <button @click.prevent="removeRule">&times;</button>
    <div v-if="operatorType === null" class="inline">
      <button @click.prevent="addBin">Add BinOp</button>
      <button @click.prevent="addUna">Add UnaryOp</button>
      <button @click.prevent="addSimple">Add SimpleRule</button>
    </div>
    <div v-else-if="operatorType === 'unary'" class="inline">
      <select v-model="operator">
        <option v-for="una in unaOp" :value="una" :key="una.operator">{{ una.label }}</option>
      </select>
      <button @click.prevent="addSubRule">+ SubRule</button>
      <button @click.prevent="cancel">Cancel</button>
    </div>
    <div v-else-if="operatorType === 'binary'" class="inline">
      <select v-model="operator">
        <option v-for="bin in binOp" :value="bin" :key="bin.operator">{{ bin.label }}</option>
      </select>
      <button @click.prevent="addSubRule">+ SubRule</button>
      <button @click.prevent="cancel">Cancel</button>
    </div>
    <div v-else class="inline">
      <select v-model="selectedModel">
        <option v-for="model in models" :key="model.name" :value="model">{{ model.label }}</option>
      </select>
      <select v-model="selectedOperator">
        <option v-for="option in options" :value="option" :key="option.operator">{{ option.label }}</option>
      </select>
      <rule-input
        v-for="input in availableInputs"
        :key="input.id"
        :type="selectedOperator.type || selectedModel.type"
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

export default {
  name: 'rule',
  components: {
    RuleInput: () => import('./RuleInput')
  },

  props: ['rule'],

  data: () => ({
    models,
    binOp: binOp,
    unaOp: unaOp,
    isLeaf: false,
    operatorType: null,
    selectedModel: null,
    selectedOperator: null,
    inputValues: [],
    mutatedRule: {},
  }),

  watch: {
    options () {
      if (this.selectedModel === this.mutatedRule.model) {
        this.selectedOperator = this.options.find(o => o.operator === this.mutatedRule.operator)
      } else {
        this.selectedOperator = this.options[0]
      }
    }
  },

  computed: {
    options () {
      return this.selectedModel ? types[this.selectedModel.type] : []
    },

    operator () {
      if (this.operatorType === 'unary') {
        return this.unaOp[0]
      } else if (this.operatorType === 'binary') {
        return this.binOp[0]
      }
      return ''
    },

    availableInputs () {
      if (!this.selectedOperator) {
        return []
      }

      const inputs = []

      for (let i = 0, inputCount =  this.selectedOperator.inputs || 1; i < inputCount; ++i) {
        inputs.push({
          id: `${this.mutatedRule.model.name}_${this.selectedOperator.operator}_${i}`,
          value: this.isOriginalOperatorSelected ? this.mutatedRule.value[i] : ''
        })
      }

      return inputs
    },

    isOriginalOperatorSelected () {
      return this.selectedModel === this.mutatedRule.model &&
        this.selectedOperator.operator === this.mutatedRule.operator
    }
  },

  created () {
    this.mutatedRule = Object.assign({}, this.rule)
    this.mutatedRule.model = this.selectedModel = this.models.find(m => m.name === this.mutatedRule.model)
    this.selectedOperator = this.options.find(o => o.operator === this.mutatedRule.operator)
    this.operatorType = this.rule.operatorType
  },

  methods: {
    onInput () {
      this.$emit('input', {
        id: this.mutatedRule.id,
        model: this.selectedModel.name,
        operator: this.selectedOperator.operator,
        value: this.availableInputs.map(input => input.value)
      })
    },

    removeRule () {
      this.$emit('remove')
    },

    addBin () {
      this.operatorType = 'binary'
    },

    addUna () {
      this.operatorType = 'unary'
    },

    addSimple () {
      this.operatorType = 'simple'
      this.isLeaf = true
    },

    cancel () {
      this.operatorType = null
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
</style>
