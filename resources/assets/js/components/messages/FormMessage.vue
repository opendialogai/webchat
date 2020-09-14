<template>
  <div class="od-message-form mt od-message-form reap">
    <div class="od-message-form--text" v-html="data.text"></div>
    <div v-if="errors.length" class="od-message-form--errors">
      <div v-for="error in errors">
        <span v-html="error"></span>
      </div>
    </div>
    <div v-for="element in data.elements" class="od-message-form--element">
      <span v-if="element.display" class="od-message-form--element-label">{{ element.display }}:</span>

      <template v-if="element.element_type == 'text'">
        <input
          class="od-message-form--element-input"
          v-model="form.data[element.name].value"
          v-on:keyup.enter="_handleClick"
          :minlength="parseInt(element.min)"
          :maxlength="parseInt(element.max)"
        />
      </template>
      <template v-if="element.element_type == 'number'">
        <input
          type="number"
          class="od-message-form--element-input"
          v-model="form.data[element.name].value"
          v-on:keyup.enter="_handleClick"
          :min="parseInt(element.min)"
          :max="parseInt(element.max)"
        />
      </template>
      <template v-if="element.element_type == 'email'">
        <input
          type="email"
          class="od-message-form--element-input"
          v-model="form.data[element.name].value"
          v-on:keyup.enter="_handleClick"
          :minlength="parseInt(element.min)"
          :maxlength="parseInt(element.max)"
        />
      </template>
      <template v-if="element.element_type == 'textarea'">
        <textarea
          class="od-message-form--element-textarea"
          v-model="form.data[element.name].value"
          :minlength="parseInt(element.min)"
          :maxlength="parseInt(element.max)"
        />
      </template>
      <template v-if="element.element_type == 'select'">
        <select
          @change="onSelectChange"
          class="od-message-form--element-select"
          v-model="form.data[element.name].value"
        >
          <option
            v-for="(option_text, option_value) in element.options"
            v-bind:value="option_value"
          >{{ option_text }}</option>
        </select>
      </template>
      <template v-if="element.element_type == 'checkbox'">
        <template v-for="(option_text, option_value) in element.options">
          <br/>
          <input type="checkbox" :id="option_value" :value="option_text" v-model="form.data[element.name][option_value]">
          <label>{{option_text}}</label>
        </template>
      </template>
      <template v-if="element.element_type == 'auto-select'">
        <v-select
          @input="onSelectChange"
          v-model="form.data[element.name].value"
          :options="element.options"
          :reduce="option => option.key"
          label="value"
        ></v-select>
      </template>
    </div>
    <button
      class="submit-button"
      v-if="!data.auto_submit"
      :disabled="fetching || currentMessage !== message"
      @click="_handleClick"
    >{{ data.submit_text }}</button>
  </div>
</template>

<script>
import vSelect from "vue-select";
import "vue-select/dist/vue-select.css";
import {mapState} from 'vuex'

export default {
  components: {
    vSelect
  },
  props: {
    data: {
      type: Object,
      required: true
    },
    message: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      form: {
        data: []
      },
      errors: []
    };
  },
  computed: {
    ...mapState({
      fetching: state => state.fetching,
      currentMessage: state => state.currentMessage
    })
  },
  methods: {
    onSelectChange() {
      if (this.data.auto_submit) {
        this._handleClick();
      }
    },
    _handleClick() {
      this.validateForm();

      if (!this.errors.length) {
        this.$store.dispatch('formSubmit', {data: this.form.data, msg: this.message})
      }
    },
    validateEmail(emailAddress) {
      if (/^[^\s@]+@[^\s@]+$/.test(emailAddress)) {
        return true;
      }

      return false;
    },
    validateForm() {
      this.errors = [];

      this.data.elements.forEach(element => {
        if (
          element.required &&
          element.element_type !== 'checkbox' &&
          element.element_type !== 'number' &&
          this.isEmpty(this.form.data[element.name].value)
        ) {
          this.errors.push(
            "<em>" + element.display + "</em> field is required"
          );
        }

        if (
                element.required &&
                element.element_type === 'number' &&
                this.isEmpty(this.form.data[element.name].value)
        ) {
          this.errors.push(
                  "<em>" + element.display + "</em> field is required and must be a valid number"
          );
        }

        if (
          element.element_type === 'email' &&
          !this.isEmpty(this.form.data[element.name].value)
        ) {
          if (!this.validateEmail(this.form.data[element.name].value)) {
            this.errors.push(
              "<em>" + element.display + "</em> field is not a valid email address"
            );
          }
        }

        if (element.element_type === 'number' && element.max && this.form.data[element.name].value > parseInt(element.max)) {
          this.errors.push(
                  "<em>" + element.display + "</em> field must be less than " + element.max
          );
        }

        if (element.element_type === 'number' && parseInt(this.form.data[element.name].value) < parseInt(element.min)) {
          this.errors.push(
                  "<em>" + element.display + "</em> field must be larger than " + element.min
          );
        }

      });
    },
    isEmpty(value) {
      return value === null || value === undefined || value === "";
    }
  },
  created() {
    this.data.elements.forEach(element => {
      this.form.data[element.name] = {
        name: element.name,
        value: ""
      };

      if (element.default_value) {
        this.form.data[element.name].value = element.default_value;
      }
    });
  }
};
</script>

<style lang="scss">
.od-message-form {
  border-radius: 6px;
  font-weight: 400;
  line-height: 1.4;
  word-wrap: break-word;
  max-width: 100%;
  -webkit-font-smoothing: subpixel-antialiased;
  font-size: 15px;
  padding: 7px 15px;

  &.reap {
    background-color: var(--od-received-message-background);
    color: var(--od-received-message-text);
  }

  .submit-button {
    cursor: pointer;
    border: 1px solid transparent;
    margin-top: 5px;
    transition: 0.4s;
    color: var(--od-button-text);
    background-color: var(--od-button-background);
    font-size: 14px;
    padding: 7px 17px;
    width: 100%;
    border-radius: 12px;
    margin-bottom: 5px;

    &[disabled] {
      background: #c8c8c8;
      pointer-events: none;
    }
  }

  .submit-button:hover {
    background-color: var(--od-button-hover-background);
    color: var(--od-button-text);
    border: 1px solid transparent;
  }

  .od-message-form--text {
    margin-bottom: 10px;
  }

  .od-message-form--element {
    margin-bottom: 10px;
  }

  .od-message-form--element-label {
    margin-right: 5px;
    vertical-align: middle;
  }
  .od-message-form--element-input {
    font-size: 13px;
    border-radius: 5px;
    border: 1px solid #a9a9a9;
    padding: 2px 7px;
  }
  .od-message-form--element-textarea {
    font-size: 13px;
    border-radius: 5px;
    border: 1px solid #a9a9a9;
    padding: 4px 7px;
    width: 100%;
    min-height: 60px;
  }
  .od-message-form--element-select {
    font-size: 13px;
  }

  .od-message-form--errors {
    background: #f55555;
    color: white;
    padding: 2px 7px;
    border-radius: 5px;
    margin-bottom: 10px;
  }

  .od-message-form--element .vs__dropdown-toggle {
    background: white;
  }
  .od-message-form--element .vs__dropdown-toggle .vs__selected-options {
    min-height: 27px;
  }
  .od-message-form--element
    .vs__dropdown-toggle
    .vs__selected-options
    .vs__selected {
    max-width: calc(100% - 5px);
  }
  .od-message-form--element
    .vs__dropdown-toggle
    .vs__selected-options
    .vs__search {
    padding: 0;
    margin: 0;
  }
  .od-message-form--element
    .vs__dropdown-toggle
    .vs__selected-options
    .vs__search:focus {
    min-width: 160px;
    margin: 4px 0 0;
    padding: 0 7px;
  }
  .od-message-form--element .vs__dropdown-menu {
    min-width: 260px;
  }
  .od-message-form--element .vs__dropdown-menu .vs__dropdown-option {
    white-space: normal;
    border-bottom: 1px solid lightgray;
  }
  .od-message-form--element .vs__dropdown-menu .vs__dropdown-option:last-child {
    border-bottom: none;
  }
  .od-message-form--element .vs--single.vs--open .vs__selected {
    position: relative;
  }
}

</style>
