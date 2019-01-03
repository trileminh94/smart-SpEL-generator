<template>
  <RuleContainer
    :rule="rule"
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
    rule: null
  }),
  created () {
    this.rule = JSON.parse(JSON.stringify(initData))
  },
  methods: {
    onRuleChanged(data) {
      // eslint-disable-next-line
      console.log(data)
    },
  }
}
</script>

<style lang="scss">
</style>
