<template>
  <div class="wrapper">
    <form class="rules" @submit.prevent="submit">
      <Rule v-if="rule !== null" :rule="rule" @input="onRuleChanged" @remove="removeRule()"/>
      <button v-if="isNoRule" @click.prevent="addRule">+ Rule</button>
    </form>
    <pre class="preview">{{ rule }}</pre>
  </div>
</template>

<script>
import models from '../config/models'
import operators from '../config/operators'

export default {
  name: 'rule-container',
  components: {
    Rule: () => import("./Rule")
  },

  props: ['rule'],

  created: () => {
    // this.rule = JSON.parse(JSON.stringify(initData))
  },

  computed: {
    isNoRule() {
      return this.rule === null;
    }
  },

  methods: {
    addRule() {
      this.rule = this.createNewRule();
    },

    onRuleChanged(data) {
      Object.assign(this.rule, data);
      this.$emit('input', this.rule)
    },

    createNewRule() {
      return {
        id: new Date().getTime(),
        isLeaf: false,
        operatorType: null,
        model: models[0].name,
        operator: operators[0].operator,
        subrules: [],
        value: []
      };
    },

    removeRule() {
      this.rule = null;
      this.notifyParentForUpdate();
    },

    notifyParentForUpdate() {
      this.$emit("input", this.rule);
    }
  }
};
</script>

<style lang="scss">
*,
*::before,
*::after {
  box-sizing: border-box;
  color: #333;
}

p,
div {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
    Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  font-size: 14px;
}

select,
button,
input {
  display: inline-block;
  background: #fff;
  height: 24px;
  padding: 0 8px;
  border: 1px solid #dadfe2;
  border-radius: 3px;
  margin-right: 4px;
}

select,
input {
  width: 128px;
}

button {
  background: #f1f4f5;
  cursor: pointer;
}

.wrapper {
  display: flex;

  > form,
  > pre {
    flex-grow: 1;
    flex-basis: 0;
    padding: 15px;
  }

  pre {
    font-family: Monaco, Consolas, Courier, monospace;
    font-size: 0.7rem;
    line-height: 1.4;
    background: #f1f4f5;
    min-height: 100vh;
  }
}
</style>


