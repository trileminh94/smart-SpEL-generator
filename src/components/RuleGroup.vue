<template>
  <div class="rule-group">
    <Rule
      v-if="mutatedGroup.isLeaf"
      :rule="mutatedGroup"
      @input="onRuleChanged"
      @remove="removeRule(mutatedGroup)"
    />
    <div v-else>
      <button @click.prevent="removeRule">&times;</button>
      <select v-model="mutatedGroup.operator">
        <option v-for="op in binop" :key="op.name" :value="op.name">{{ op.label }}</option>
      </select>
      <div style="margin-left: 20px;">
        <Rule
          v-for="rule in mutatedGroup.subrules"
          :key="rule.id"
          :rule="rule"
          @input="onRuleChanged"
          @remove="removeRule(rule)"
        />
      </div>
    </div>
    <button @click.prevent="addRule">+ AND</button>
  </div>
</template>

<script>
import models from '../config/models'
import operators from '../config/operators'
import binop from '../config/binop'

export default {
  props: ['group', 'isFirstGroup'],

  components: {
    Rule: () => import('./Rule')
  },

  data: () => ({
    binop: binop,
    mutatedGroup: {}
  }),

  created () {
    this.mutatedGroup = JSON.parse(JSON.stringify(this.group))
  },

  methods: {
    onRuleChanged (data) {
      let changedRule = this.mutatedGroup.subrules.find(r => r.id === data.id)
      Object.assign(changedRule, data)
      this.notifyParentForUpdate()
    },

    addRule () {
      this.mutatedGroup.subrules.push(this.createRule())
    },

    createRule () {
      return {
        id: (new Date).getTime(),
        isLeaf: false,
        operatorType: null,
        model: models[0].name,
        operator: operators[0].operator,
        subrules: [],
        value: []
      }
    },

    removeRule (rule) {
      this.mutatedGroup.subrules = this.mutatedGroup.subrules.filter(r => r.id !== rule.id)
      this.notifyParentForUpdate()
    },

    remove () {
      this.$emit('remove')
    },

    notifyParentForUpdate () {
      this.$emit('input', this.mutatedGroup)
    }
  }
}
</script>

<style lang="scss" scoped>
.rule-group {
  margin-bottom: 12px;
  padding: 12px 0;
  border-bottom: 1px solid #ddd;
}

.group-banner {
  margin-bottom: 16px;
  font-weight: 300;
  font-size: 1.3rem;
  color: #333;
}
</style>
