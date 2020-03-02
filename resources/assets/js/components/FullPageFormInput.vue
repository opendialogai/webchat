<template>
  <div class="sc-full-page-form-input--container" :style="{backgroundColor: colors.messageList.bg}">
    <div class="sc-full-page-form-input" :style="{color: colors.receivedMessage.text, backgroundColor: colors.receivedMessage.bg}">
      <div class="sc-message--fp-form--text" v-html="message.data.text"></div>
      <div v-if="errors.length" class="sc-message--fp-form--errors">
        <div v-for="error in errors">
          <span v-html="error"></span>
        </div>
      </div>
      <div v-for="element in message.data.elements" class="sc-message--fp-form--element">
        <span v-if="element.display" class="sc-message--fp-form--element-label">{{ element.display }}:</span>

        <template v-if="element.element_type == 'text'">
          <input
            class="sc-message--fp-form--element-input"
            v-model="form.data[element.name].value"
            v-on:keyup.enter="_handleClick"
          />
        </template>
        <template v-if="element.element_type == 'number'">
          <input
            type="number"
            class="sc-message--fp-form--element-input"
            v-model="form.data[element.name].value"
            v-on:keyup.enter="_handleClick"
          />
        </template>
        <template v-if="element.element_type == 'textarea'">
          <textarea
            class="sc-message--fp-form--element-textarea"
            v-model="form.data[element.name].value"
          />
        </template>
        <template v-if="element.element_type == 'select'">
          <select
            @change="onSelectChange"
            class="sc-message--fp-form--element-select"
            v-model="form.data[element.name].value"
          >
            <option
              v-for="(option_text, option_value) in element.options"
              v-bind:value="option_value"
            >{{ option_text }}</option>
          </select>
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
        v-if="!message.data.auto_submit"
        @click="_handleClick"
        :style="{'--btn-bg': colors.button.bg, '--btn-text-color': colors.button.text, '--button-hover': colors.button.hoverbg}"
      >{{ message.data.submit_text }}</button>
    </div>
  </div>
</template>

<script>
import vSelect from "vue-select";
import "vue-select/dist/vue-select.css";

export default {
  components: {
    vSelect
  },
  props: {
    onSubmit: {
      type: Function,
      required: true
    },
    message: {
      type: Object,
      required: true
    },
    colors: {
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
  methods: {
    onSelectChange() {
      if (this.message.data.auto_submit) {
        this._handleClick();
      }
    },
    _handleClick() {
      this.validateForm();

      if (!this.errors.length) {
        this.onSubmit(this.form.data);
      }
    },
    validateForm() {
      this.errors = [];

      this.message.data.elements.forEach(element => {
        if (
          element.required &&
          this.isEmpty(this.form.data[element.name].value)
        ) {
          this.errors.push(
            "<em>" + element.display + "</em> field is required"
          );
        }
      });
    },
    isEmpty(value) {
      return value === null || value === undefined || value === "";
    }
  },
  created() {
    this.message.data.elements.forEach(element => {
      this.form.data[element.name] = {
        name: element.name,
        value: ""
      };
    });
  }
};
</script>

<style scoped>
.sc-full-page-form-input--container {
  flex: 1;
}
.sc-full-page-form-input .sc-message--fp-form--errors {
  background: #f55555;
  color: white;
  padding: 2px 7px;
  border-radius: 5px;
  margin-bottom: 10px;
}

.sc-full-page-form-input button {
  cursor: pointer;
  border-radius: 15px;
  border: none;
  font-size: 14px;
  padding: 12px 17px;
  margin-top: 5px;
  transition: 0.4s;
  color: var(--btn-text-color);
  background-color: var(--btn-bg);
}

.sc-full-page-form-input button:hover {
  background-color: var(--button-hover) !important;
  color: #0000ff;
  border: 1px solid #0000ff;
}

.sc-full-page-form-input .sc-message--fp-form--text {
  margin-bottom: 10px;
}

.sc-full-page-form-input .sc-message--fp-form--element {
  margin-bottom: 10px;
}

.sc-full-page-form-input .sc-message--fp-form--element-label {
  margin-right: 5px;
  vertical-align: middle;
}
.sc-full-page-form-input .sc-message--fp-form--element-input {
  font-size: 13px;
  border-radius: 5px;
  border: 1px solid #a9a9a9;
  padding: 2px 7px;
}
.sc-full-page-form-input .sc-message--fp-form--element-textarea {
  font-size: 13px;
  border-radius: 5px;
  border: 1px solid #a9a9a9;
  padding: 4px 7px;
  width: 100%;
  min-height: 60px;
}
.sc-full-page-form-input .sc-message--fp-form--element-select {
  font-size: 13px;
}

.sc-full-page-form-input .sc-message--fp-form--errors {
  background: #f55555;
  color: white;
  padding: 2px 7px;
  border-radius: 5px;
  margin-bottom: 10px;
}
</style>

<style>
.sc-message--fp-form--element .vs__dropdown-toggle {
  background: white;
}
.sc-message--fp-form--element .vs__dropdown-toggle .vs__selected-options {
  min-height: 27px;
}
.sc-message--fp-form--element
  .vs__dropdown-toggle
  .vs__selected-options
  .vs__selected {
  max-width: calc(100% - 5px);
}
.sc-message--fp-form--element
  .vs__dropdown-toggle
  .vs__selected-options
  .vs__search {
  padding: 0;
  margin: 0;
}
.sc-message--fp-form--element
  .vs__dropdown-toggle
  .vs__selected-options
  .vs__search:focus {
  min-width: 160px;
  margin: 4px 0 0;
  padding: 0 7px;
}
.sc-message--fp-form--element .vs__dropdown-menu {
  min-width: 260px;
}
.sc-message--fp-form--element .vs__dropdown-menu .vs__dropdown-option {
  white-space: normal;
  border-bottom: 1px solid lightgray;
}
.sc-message--fp-form--element .vs__dropdown-menu .vs__dropdown-option:last-child {
  border-bottom: none;
}
.sc-message--fp-form--element .vs--single.vs--open .vs__selected {
  position: relative;
}
</style>
