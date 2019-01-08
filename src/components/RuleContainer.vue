<template>
  <div class="wrapper">
    <div style="display: flex; flex-direction: column; flex-grow: 1; padding: 20px; min-width: 600px !important;">
        <form class="rules" @submit.prevent="submit" >
            <Rule v-if="rule !== null && type == 'logjob'" :rule="rule" @input="onRuleChanged" @remove="removeRule()"/>
            <button v-if="isNoRule" @click.prevent="addRule">+ Rule LogJob</button>
            <button v-if="isNoRule" @click.prevent="addRuleNoFormat">+ Rule LogArr</button>
        </form>
        <div style="width: 100%; padding: 10px; margin-top: 20px;">
            <label style="display: block;">Validation Rule: </label>
            <textarea disabled class="ruleInput" :value="code"></textarea>
        </div>
    </div>
    <pre class="preview" style="max-width: 300px;">{{ rule }}</pre>
  </div>
</template>

<script>
import models from '../config/models'
import operators from '../config/operators'
import { genCode } from '../config/gencode'

export default {
  name: 'rule-container',
  components: {
    Rule: () => import("./Rule")
  },

  props: ['rule', 'type'],

  created: () => {
    // this.rule = JSON.parse(JSON.stringify(initData))
  },

  computed: {
    isNoRule() {
      return this.rule === null;
    },
    code () {
        if (this.type == 'logjob') {
            return "(logJob != null && " + genCode(this.rule) + ")"
        } else {
            return ""
        }
    }
  },

  methods: {
    addRule() {
      this.rule = this.createNewRule();
      this.type = 'logjob';
    },

    addRuleNoFormat() {
      this.rule = this.createNewArrRule();
      this.type = 'logarr';
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

    createNewArrRule() {
      return {
        
      }
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

select {
  width: auto;
}

input {
    width: 120px;
}

button {
  background: #f1f4f5;
  cursor: pointer;
}

.wrapper {
  display: flex;

  > form {
    flex-grow: 1;
    flex-basis: 0;
    padding: 15px;
  }

  > pre {
    flex-grow: 2;
    flex-basis: 0;
    padding: 15px;
  }

   label {
       font-size: 14px;
       font-weight: 400;
       color: #555;
   }

  .ruleInput {
    background-color: white;
    font-size: 14px;
    width: 100%;
    border: 1px solid rgb(221, 221, 221);
    min-height: 60px;
    padding: 10px;
    margin-top: 10px;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
    Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
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


