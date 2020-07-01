<template>
  <div class="mt sc-message--form" :style="messageColors">
    <div class="sc-message--form--text" v-html="data.text"></div>
    <div v-if="errors.length" class="sc-message--form--errors">
      <div v-for="error in errors">
        <span v-html="error"></span>
      </div>
    </div>
    <div v-for="element in data.elements" class="sc-message--form--element">
      <span v-if="element.display" class="sc-message--form--element-label">{{ element.display }}:</span>

      <template v-if="element.element_type == 'text'">
        <input
          class="sc-message--form--element-input"
          v-model="form.data[element.name].value"
          v-on:keyup.enter="_handleClick"
        />
      </template>
      <template v-if="element.element_type == 'number'">
        <input
          type="number"
          class="sc-message--form--element-input"
          v-model="form.data[element.name].value"
          v-on:keyup.enter="_handleClick"
        />
      </template>
      <template v-if="element.element_type == 'email'">
        <input
          type="email"
          class="sc-message--form--element-input"
          v-model="form.data[element.name].value"
          v-on:keyup.enter="_handleClick"
        />
      </template>
      <template v-if="element.element_type == 'textarea'">
        <textarea
          class="sc-message--form--element-textarea"
          v-model="form.data[element.name].value"
        />
      </template>
      <template v-if="element.element_type == 'select'">
        <select
          @change="onSelectChange"
          class="sc-message--form--element-select"
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
      v-if="!data.auto_submit"
      @click="_handleClick"
      :style="{'--btn-bg': colors.button.bg, '--btn-text-color': colors.button.text, '--button-hover': colors.button.hoverbg}"
    >{{ data.submit_text }}</button>
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
    data: {
      type: Object,
      required: true
    },
    colors: {
      type: Object,
      required: true
    },
    message: {
      type: Object,
      required: true
    },
    messageColors: {
      type: Object,
      required: true
    },
    onFormButtonClick: {
      type: Function,
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
      if (this.data.auto_submit) {
        this._handleClick();
      }
    },
    _handleClick() {
      this.validateForm();

      if (!this.errors.length) {
        this.onFormButtonClick(this.form.data, this.message);
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
          this.isEmpty(this.form.data[element.name].value)
        ) {
          this.errors.push(
            "<em>" + element.display + "</em> field is required"
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

<style scoped>
.sc-message--form {
  padding: 17px 20px;
  border-radius: 6px;
  font-weight: 400;
  font-size: 14px;
  line-height: 1.4;
  word-wrap: break-word;
  max-width: 100%;
  -webkit-font-smoothing: subpixel-antialiased;
}

.sc-message--form button {
  cursor: pointer;
  border-radius: 15px;
  border: 1px solid transparent;
  font-size: 14px;
  padding: 12px 17px;
  margin-top: 5px;
  transition: 0.4s;
  color: var(--btn-text-color);
  background-color: var(--btn-bg);
}

.sc-message--form button:hover {
  background-color: var(--button-hover) !important;
  color: #0000ff;
  border: 1px solid #0000ff;
}

.sc-message--content.sent .sc-message--form {
  color: white;
  background-color: #4e8cff;
}
.sc-message--content.received .sc-message--form {
  color: #263238;
  background-color: #f4f7f9;
}

.sc-message--form .sc-message--form--text {
  margin-bottom: 10px;
}

.sc-message--form .sc-message--form--element {
  margin-bottom: 10px;
}

.sc-message--form .sc-message--form--element-label {
  margin-right: 5px;
  vertical-align: middle;
}
.sc-message--form .sc-message--form--element-input {
  font-size: 13px;
  border-radius: 5px;
  border: 1px solid #a9a9a9;
  padding: 2px 7px;
}
.sc-message--form .sc-message--form--element-textarea {
  font-size: 13px;
  border-radius: 5px;
  border: 1px solid #a9a9a9;
  padding: 4px 7px;
  width: 100%;
  min-height: 60px;
}
.sc-message--form .sc-message--form--element-select {
  font-size: 13px;
}

.sc-message--form .sc-message--form--errors {
  background: #f55555;
  color: white;
  padding: 2px 7px;
  border-radius: 5px;
  margin-bottom: 10px;
}
</style>

<style>
.sc-message--form--element .vs__dropdown-toggle {
  background: white;
}
.sc-message--form--element .vs__dropdown-toggle .vs__selected-options {
  min-height: 27px;
}
.sc-message--form--element
  .vs__dropdown-toggle
  .vs__selected-options
  .vs__selected {
  max-width: calc(100% - 5px);
}
.sc-message--form--element
  .vs__dropdown-toggle
  .vs__selected-options
  .vs__search {
  padding: 0;
  margin: 0;
}
.sc-message--form--element
  .vs__dropdown-toggle
  .vs__selected-options
  .vs__search:focus {
  min-width: 160px;
  margin: 4px 0 0;
  padding: 0 7px;
}
.sc-message--form--element .vs__dropdown-menu {
  min-width: 260px;
}
.sc-message--form--element .vs__dropdown-menu .vs__dropdown-option {
  white-space: normal;
  border-bottom: 1px solid lightgray;
}
.sc-message--form--element .vs__dropdown-menu .vs__dropdown-option:last-child {
  border-bottom: none;
}
.sc-message--form--element .vs--single.vs--open .vs__selected {
  position: relative;
}
</style>
