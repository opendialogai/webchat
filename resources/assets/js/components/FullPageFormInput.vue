<template>
  <div
    class="mt-fp-form"
    :style="{
            '--messageListBg': colors.messageList.bg,
            '--btn-bg': colors.button.bg,
            '--btn-bg-hover': colors.button.hoverbg,
            '--btn-text-color': colors.button.text,
            '--btn-text-color-hover':  colors.button.hoverText,
            '--btn-border-color':colors.button.border,
            '--btn-border-color-hover':colors.button.hoverBorder,


            '--labelTextColor' :colors.form.labelTextColor,
            '--formHighlightColor'  :colors.form.formHighlightColor,
            '--inputBorderColor' :colors.form.inputBorderColor }"
  >
    <div class="mt-fp-form__title" v-html="message.data.text"></div>

    <div v-if="errors.length" class="sc-message--fp-form--errors">
      <div v-for="error in errors">
        <span v-html="error"></span>
      </div>
    </div>

    <div v-for="element in message.data.elements" class="mt-fp-form__element">
      <span
        v-if="element.display"
        class="mt-fp-form__label"
        :class="{ 'mt-fp-form__label--radio' : element.element_type == 'radio'}"
      >{{ element.display }}</span>

      <template v-if="element.element_type == 'text'">
        <input
          type="text"
          class="mt-fp-form__input"
          v-model="form.data[element.name].value"
          v-on:keyup.enter="_handleClick"
        />
      </template>

      <template v-if="element.element_type == 'textarea'">
        <textarea
          class="mt-fp-form__input mt-fp-form__textarea"
          v-model="form.data[element.name].value"
        />
      </template>

      <template v-if="element.element_type == 'select'">
        <select
          @change="onSelectChange"
          class="mt-fp-form__select"
          v-model="form.data[element.name].value"
        >
          <option value>-- Please choose an option --</option>
          <option
            v-for="(option_text, option_value) in element.options"
            v-bind:value="option_value"
          >{{ option_text }}</option>
        </select>
      </template>

      <template v-if="element.element_type == 'radio'">
        <div class="mt-fp-form__radio">
          <div
            class="mt-fp-form__radio-btn"
            v-for="(radio_text, radio_value) in element.options"
            :key="radio_value"
          >
            <input
              name="contact-option"
              type="radio"
              v-bind:id="radio_value"
              v-bind:value="radio_value"
            />
            <label v-bind:for="radio_value">{{ radio_text }}</label>
          </div>
        </div>
      </template>

      <template v-if="element.element_type == 'auto-select'">
        <v-select
          class="mt-fp-form__auto-select style-chooser"
          @input="onSelectChange"
          v-model="form.data[element.name].value"
          :options="element.options"
          :reduce="option => option.key"
          label="value"
        ></v-select>
      </template>

      <template v-if="element.element_type == 'email'">
        <input
          type="email"
          class="mt-fp-form__input"
          v-model="form.data[element.name].value"
          v-on:keyup.enter="_handleClick"
        />
      </template>

      <template v-if="element.element_type == 'number'">
        <input
          type="tel"
          class="mt-fp-form__input"
          v-model="form.data[element.name].value"
          v-on:keyup.enter="_handleClick"
        />
      </template>
    </div>

    <button
      class="mt-fp-form__submit"
      v-if="!message.data.auto_submit"
      @click="_handleClick"
    >{{ message.data.submit_text }}</button>
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
.mt-fp-form__title {
  margin-bottom: 20px;
}

/* form --- form --- form ---  */

.mt-fp-form {
  flex: 1;
  padding-top: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: var(--messageListBg);
  overflow-y: auto;
}

.mt-fp-form__element {
  position: relative;
  width: 90%;
  margin: 0 auto 18px;
}

/* labels --- labels --- labels ---  */

.mt-fp-form__label {
  position: absolute;
  top: -5px;
  left: 10px;
  background-color: white;
  font-size: 13px;
  line-height: 1;
  margin: 0;
  color: var(--labelTextColor);
}

.mt-fp-form__label--radio {
  position: unset;
  font-size: 16px;
  font-weight: normal;
  line-height: 1.38;
  letter-spacing: normal;
  color: unset;
}

/* input --- input --- input ---  */

.mt-fp-form__input {
  border-radius: 4px;
  border: solid 1px #979797;
  height: 40px;
  padding: 0 10px;
  width: 100%;
}

.mt-fp-form__input:focus {
  outline: none;
  border: 1px solid var(--btn-bg);
}

/* textarea -- */

.mt-fp-form__textarea {
  height: 120px;
  padding: 10px;
}

/*
styling <select> is notoriously difficult </select>
maybe look into https://cdnjs.com/libraries/bootstrap-select
*/

.mt-fp-form__select {
  width: 100%;
  display: block;
  padding: 0.6em 1.4em 0.5em 0.8em;
  font-style: 20px;
  line-height: 2.5;
  height: 40px;
}

.mt-fp-form__select:focus {
  outline: none;
  border: 1px solid var(--btn-bg);
}

.mt-fp-form__select:active,
.mt-fp-form__select:hover {
  outline: none;
  border: 1px solid var(--btn-bg);
}

/*
v-select --- v-select --- v-select ---
https://vue-select.org/guide/css.html#overriding-default-styles
doesnt work though 🤦🏻‍♂️
*/

.mt-fp-form__auto-select {
  width: 100%;
  display: block;
  font-style: 20px;
  line-height: 2.5;
  height: 40px;
  margin: 0;
}

.style-chooser .vs__search::placeholder,
.style-chooser .vs__dropdown-toggle,
.style-chooser .vs__dropdown-menu {
  background: #dfe5fb;
  border: none;
  color: #394066;
  text-transform: lowercase;
  font-variant: small-caps;
}

.style-chooser .vs__clear,
.style-chooser .vs__open-indicator {
  fill: #394066;
}

/* radio --- radio --- radio ---  */

.mt-fp-form__radio {
  display: flex;
  margin: 10px 0 20px;
}

.mt-fp-form__radio-btn {
  margin-right: 22px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.mt-fp-form__radio-btn label {
  margin: 8px 0 0 16px;
  font-size: 16px;
  line-height: 1;
}

.mt-fp-form__radio-btn input[type="radio"] {
  -ms-transform: scale(1.7); /* IE 9 */
  -webkit-transform: scale(1.7); /* Chrome, Safari, Opera */
  transform: scale(1.7);
  color: var(--btn-bg);
  background-color: var(--btn-bg);
  border: solid 1px var(--btn-bg);
}

/* submit --- submit --- submit ---  */

.mt-fp-form__submit {
  color: var(--btn-text-color);
  background-color: var(--btn-bg);
  min-height: 60px;
  width: 280px;
  padding: 0 20px;
  border-radius: 30px;
  margin-bottom: 20px;
}

.mt-fp-form__submit:hover {
  color: var(--btn-text-color-hover);
  background-color: var(--btn-bg-hover);
}

/*

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
} */
/*
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
.sc-message--fp-form--element
  .vs__dropdown-menu
  .vs__dropdown-option:last-child {
  border-bottom: none;
}
.sc-message--fp-form--element .vs--single.vs--open .vs__selected {
  position: relative;
} */
</style>
