<template>
  <RuleContainer
    :rule="rule"
    @input="onRuleChanged"
  />
</template>

<script>
export default {
  components: {
    RuleContainer: () => import("./components/RuleContainer")
  },
  data: () => ({
    rule: null
  }),
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
