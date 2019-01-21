<template>
  <RuleContainer
    :rule="rule"
    :type="type"
    @input="onRuleChanged"
  />
</template>

<script>
import initData from './stubs/data'

export default {
  components: {
    RuleContainer: () => import("./components/RuleContainer")
  },
  data: () => ({
    rule: null,
    type: null
  }),
  created () {
    this.rule = JSON.parse(JSON.stringify(initData))
    this.type = 'logjob'
  },
  methods: {
    onRuleChanged(data) {
    },
  }
}
</script>

<style lang="scss">
</style>
