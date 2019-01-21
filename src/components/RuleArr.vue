<template>
  <div>
    <div>
      <label class="inline" for="" style="margin-right: 10px;">Num Column : </label>
      <input type="number" v-model="numcolum">
    </div>
    <div v-if="numcolum > 0">
      <div v-for="rule in rules.subrules" :key="rule.id" class="rule-wrapper">
        <div class="inline">
            <div style="display: inline-block; vertical-align: top; margin-left: -23px;">
                <button @click.prevent="removeRule(rule)">&times;</button>
            </div>
            <label for="" style="margin-right: 10px;"> Column </label>
            <input type="number" v-model="rule.column" @input="notifyToParent">
            <select v-model="rule.operator" v-bind:on-change="notifyToParent">
              <option v-for="opa in operators" :value="opa" :key="opa.operator">{{ opa.label }}</option>
            </select>
            <input v-if="hasInput(rule)" type="text" v-model="rule.value" @input="notifyToParent">
            <Alert v-if="!isValid(rule)" />
        </div>
      </div>
      <button v-if="canAddMoreRule" @click.prevent="addRule">+ Rule</button>
    </div>
  </div>
</template>

<script>
import types from '../config/types'

export default {
  name: 'RuleArr',
  components: {
    Alert: () => import('./Alert'),
    RuleInput: () => import('./RuleInput')
  },
  props: ['rule'],
  data() {
    return {
      rules: {},
      numcolum: 0
    }
  },
  created () {
    this.rules = Object.assign({}, this.rule)
    this.rules.numcolumn = 0
  },
  computed: {
    operators () {
        return types.column
    },
    canAddMoreRule () {
        return this.rules.subrules.length < this.numcolum
    },
    subrules () {
        return this.rules.subrules
    }
  },
  methods: {
    removeRule (rule) {
        this.rules.subrules = this.rules.subrules.filter((x) => x.id !== rule.id)
    },
    isValid (rule) {
        if (this.hasInput(rule)) {
            return (rule.column - 0) >= 0 && (rule.column - 0) < this.numcolum && rule.value != ''
        }
        return (rule.column - 0) >= 0 && (rule.column - 0) < this.numcolum
    },
    hasInput (rule) {
      if (!rule.operator || !rule.column) {
        return false
      }
      if (rule.operator.inputs === undefined) {
          return true
      }
      if (rule.operator.inputs !== undefined && rule.operator.inputs > 0) {
          return true
      }
      return false
    },
    addRule () {
      if (this.rules.subrules === undefined) {
        this.rules.subrules = []
      }
      this.rules.subrules.push({id: (new Date()).getTime(), column: -1, value: ''})
    },
    notifyToParent () {
      var self = this
      var reducer = (a, b) => a && self.isValid(b)
      var isAllValid = this.rules.subrules.reduce(reducer, true)
      if (isAllValid) {
        this.rules.numcolumn = parseInt(this.rules.numcolumn)
        this.$emit('input', this.rules)
      }
    }
  },
  watch: {
    subrules () {
      this.notifyToParent()
    },
    numcolum (newData) {
      this.rules.numcolumn = newData
      this.notifyToParent()
    }
  }
}
</script>

<style scoped>
.inline {
  display: inline-block;
}

.rule-wrapper {
  padding: 5px;
}
</style>
