<template>
  <div
    class="od-fp-form"
    :class="{ loader: showLoader }"
  >
    <div class="od-fp-form__elements">
      <div
        class="od-fp-form__title animateStartingState animateDelay1"
        :class="{animateSlideUp: isOpen}"
        v-html="message.data.text"
      ></div>

      <div
        v-for="element in message.data.elements"
        class="od-fp-form__element animateStartingState animateDelay2"
        :class="[{animateSlideUp: isOpen}, element.name]"
        v-bind:key="element.id"
        :ref="element.name"
      >
        <span
          v-if="element.display && element.element_type == 'radio'"
          class="od-fp-form__label"
          :class="[
          { 'od-fp-form__label--radio' : element.element_type == 'radio'},
          { 'od-fp-form__label--error' : errors.find(x => x.type === element.name)}
          ]"
        >{{ element.display }}</span>

        <template v-if="element.element_type == 'text'">
          <input
            type="text"
            class="od-fp-form__input"
            v-model="form.data[element.name].value"
            @input="validateOnChange"
            v-on:keyup.enter="_handleClick"
            :placeholder="element.display"
            :class="{ 'od-fp-form__input--error' : errors.find(x => x.type === element.name)}"
          />
        </template>

        <template v-if="element.element_type == 'textarea'">
          <textarea
            class="od-fp-form__input od-fp-form__textarea"
            v-model="form.data[element.name].value"
            @input="validateOnChange"
            :placeholder="element.display"
          />
        </template>

        <template v-if="element.element_type == 'select'">
          <select
            @change="onSelectChange"
            class="od-fp-form__select"
            v-model="form.data[element.name].value"
          >
            <option value>{{ element.display }}</option>
            <option
              v-for="(option_text, option_value) in element.options"
              v-bind:value="option_value"
            >{{ option_text }}</option>
          </select>
        </template>

        <template v-if="element.element_type == 'radio'">
          <div class="od-fp-form__radio">
            <div
              class="od-fp-form__radio-btn"
              v-for="(radio_text, radio_value) in element.options"
              :key="radio_value"
            >
              <input
                name="radio"
                type="radio"
                v-bind:id="radio_value"
                v-bind:value="radio_value"
                v-model="form.data[element.name].value"
                @input="validateOnChange"
              />

              <label v-bind:for="radio_value">{{ radio_text }}</label>
            </div>
          </div>
        </template>

        <template v-if="element.element_type == 'auto-select'">
          <v-select
            class="od-fp-form__auto-select style-chooser"
            @input="onSelectChange"
            @open="onSelectOpen(element.name)"
            @close="onSelectClose(element.name)"
            v-model="form.data[element.name].value"
            :options="element.options"
            :reduce="option => option.key"
            :placeholder="element.display"
            :select-on-tab="true"
            label="value"
            :class="{ 'od-fp-form__v-select--error' : errors.find(x => x.type === element.name)}"
          ></v-select>
        </template>

        <template v-if="element.element_type == 'email'">
          <input
            type="email"
            class="od-fp-form__input"
            v-model="form.data[element.name].value"
            @input="validateOnChange"
            v-on:keyup.enter="_handleClick"
            :placeholder="element.display"
            :class="{ 'od-fp-form__input--error' : errors.find(x => x.type === element.name)}"
          />
        </template>

        <template v-if="element.element_type == 'number'">
          <input
            type="tel"
            class="od-fp-form__input"
            v-model="form.data[element.name].value"
            @input="validateOnChange"
            v-on:keyup.enter="_handleClick"
            :placeholder="element.display"
            :class="{ 'od-fp-form__input--error' : errors.find(x => x.type === element.name)}"
          />
        </template>
      </div>

      <div
        v-if="errorMessages"
        class="od-fp-form__error animateStartingState animateDelay1"
        :class="{animateSlideUp: isOpen}"
        >
        <p v-for="error in errorMessages">{{ error }}</p>
      </div>

      <div class="od-fp-form__submit-wrapper">
        <button
          class="od-fp-form__submit"
          v-if="!message.data.auto_submit"
          @click="_handleClick"
        >{{ message.data.submit_text }}</button>
      </div>

      <div
        v-if="message.data.cancel_text && message.data.cancel_callback"
        class="od-fp-form__cancel-wrapper"
      >
        <button class="od-fp-form__cancel" @click="_handleCancel">{{ message.data.cancel_text }}</button>
      </div>
    </div>

    <template v-if="showLoader">
      <div class="fp-loader">
        <div class="fp-loader">
          <svg xmlns:svg="http://www.w3.org/2000/svg" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.0" width="38px" height="38px" viewBox="0 0 128 128" xml:space="preserve">
          <g>
            <path d="M64 9.75A54.25 54.25 0 0 0 9.75 64H0a64 64 0 0 1 128 0h-9.75A54.25 54.25 0 0 0 64 9.75z" fill="#da291c" fill-opacity="1"/>
            <animateTransform attributeName="transform" type="rotate" from="0 64 64" to="360 64 64" dur="1000ms" repeatCount="indefinite"></animateTransform>
          </g>
        </svg>
        </div>
      </div>
    </template>
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
    onCancel: {
      type: Function,
      required: true
    },
    message: {
      type: Object,
      required: true
    },
    isOpen: {
      type: Boolean,
      default: () => false
    }
  },
  computed: {
    requiredErrorMessage() {
      return this.errors.find(x => x.errorType === 'required') ? 'Missing required fields.' : '';
    },
    validErrorMessage() {
      let field = this.errors.find(x => x.errorType === 'valid');
      return field ? field.message : '';
    },
    errorMessages() {
      let message = [];

      if (this.requiredErrorMessage !== '') {
        message.push(this.requiredErrorMessage);
      }

      if (this.validErrorMessage !== '') {
        message.push(this.validErrorMessage);
      }

      return message;
    },
  },
  data() {
    return {
      attemptedSubmit: false,
      picked: "",
      form: {
        data: []
      },
      errors: [],
      showLoader: false
    };
  },
  watch: {
    message() {
      this.setUp();
    }
  },
  methods: {
    setUp() {
        this.showLoader = false;

        this.form.data = [];

        this.message.data.elements.forEach(element => {
            this.form.data[element.name] = {
                name: element.name,
                value: ""
            };

          if (element.default_value) {
            this.form.data[element.name].value = element.default_value;
          }
        });

        this.validateOnChange = _.debounce(this.validateOnChangeForDebounce, 300);
    },
    validateOnChangeForDebounce() {
      if (this.attemptedSubmit) {
        this.validateForm();
      }
    },
    onSelectChange() {
      this.validateOnChange();

      if (this.message.data.auto_submit) {
        this._handleClick();
      }
    },
    onSelectOpen(element) {
      this.$refs[element][0].style.zIndex = 1;
    },
    onSelectClose(element) {
      this.$refs[element][0].style.zIndex = '';
    },
    _handleCancel() {
      if (!this.showLoader) {
        this.onCancel(this.form.data);
        this.showLoader = true;
      }
    },
    _handleClick() {
      if (!this.showLoader) {
        this.validateForm();
        if (this.errors.length) {
          this.attemptedSubmit = true;
        } else {
          this.$store.dispatch('formSubmit', {data: this.form.data, msg: this.$store.state.currentMessage})

          this.showLoader = true;
        }
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

      this.message.data.elements.forEach(element => {
        if (
          element.required &&
          this.isEmpty(this.form.data[element.name].value)
        ) {
          this.errors.push({
            type: element.name,
            errorType: "required",
            message: "<em>" + element.display + "</em> is required"
          });
        }

        if (
          element.element_type === "email" &&
          !this.isEmpty(this.form.data[element.name].value)
        ) {
          if (!this.validateEmail(this.form.data[element.name].value)) {
            this.errors.push({
              type: element.name,
              errorType: "valid",
              message: "Invalid Email Address."
            });
          }
        }
      });
    },
    isEmpty(value) {
      return value === null || value === undefined || value === "";
    }
  },

  created() {
    this.setUp();
  }
};
</script>

<style lang="scss">
.od-fp-form {
  background-color: var(--od-message-list-background);
  overflow-x: hidden;
  position: relative;
  flex: 1;
  min-height: 30px;

  .od-fp-form__title {
    margin-bottom: 20px;
    width: 100%;
    text-align: center;
    color: var(--od-sent-message-text);
  }

  &.loader {
    overflow-y: hidden;
  }

  .od-fp-form__elements {
    width: 90%;
    margin: 0 auto;
    flex: 1;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    padding-top: 20px;
    overflow-y: auto;
  }

  .od-fp-form__element {
    position: relative;
    width: 100%;
    margin: 0 auto 18px;
  }

  .first_name,
  .last_name {
    width: 47%;
    padding: 0;
    margin: 0 0 18px;
  }

  /* error --- error --- error --- */

  .od-fp-form__error {
    margin-bottom: 20px;
    width: 100%;
    text-align: center;
  }

  .od-fp-form__error p {
    margin-top: 10px;
    color: #da291c;
  }

  /* labels --- labels --- labels ---  */

  .od-fp-form__label {
    z-index: 1;
    position: absolute;
    top: -5px;
    left: 10px;
    background-color: white;
    font-size: 13px;
    line-height: 1;
    margin: 0;
    color: var(--od-sent-message-text);
  }

  .od-fp-form__label--radio {
    position: unset;
    font-size: 16px;
    font-weight: normal;
    line-height: 1.38;
    letter-spacing: normal;
    color: #ffffff;
    background-color: transparent;
  }

  .od-fp-form__label--error {
    color: var(--od-button-background);
  }

  .od-fp-form__label--error:before {
    content: "*";
  }

  /* input --- input --- input ---  */

  .od-fp-form__input {
    border-radius: 4px;
    border: 1px solid #979797;
    height: 40px;
    padding: 0 10px;
    width: 100%;
  }

  .od-fp-form__input--error {
    outline: none;
    border: 1px solid #da291c;
  }

  .od-fp-form__input:focus {
    outline: none;
    border: 1px solid var(--od-button-background);
  }

  /* textarea -- */
  .od-fp-form__textarea {
    height: 100px;
    padding: 10px;
  }

  /*
  styling <select> is notoriously difficult </select>
  maybe look into https://cdnjs.com/libraries/bootstrap-select
  */

  .od-fp-form__select {
    width: 100%;
    display: block;
    padding: 0.6em 1.4em 0.5em 0.8em;
    font-size: 20px;
    line-height: 2.5;
    height: 40px;
  }

  .od-fp-form__select:focus {
    outline: none;
    border: 1px solid var(--od-button-background);
  }

  .od-fp-form__select:active,
  .od-fp-form__select:hover {
    outline: none;
    border: 1px solid var(--od-button-background);
  }

  /*
  v-select --- v-select --- v-select ---
  https://vue-select.org/guide/css.html#overriding-default-styles
  doesnt work though 🤦🏻‍♂️
  */

  .vs__search {
    font-size: 16px;

    &::placeholder {
      color: #757575
    }
  }

  .vs__dropdown-toggle {
    border-radius: 4px;
    border: 1px solid #979797;
    height: 40px;
    width: 100%;
    background: white;
  }

  .vs__selected {
    font-size: 16px;
    line-height: 1.8;
  }

  .vs__dropdown-menu {
    font-size: 16px;
  }

  .od-fp-form__v-select--error .vs__dropdown-toggle {
    outline: none;
    border: 1px solid #da291c;
  }

  .od-fp-form__auto-select {
    width: 100%;
    display: block;
    font-size: 20px;
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

  .od-fp-form__radio {
    display: flex;
    margin: 20px auto 20px;
    padding: 0 0 0 30px;
  }

  .od-fp-form__radio-btn {
    margin-right: 22px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: relative;

    width: 80px;
  }

  .od-fp-form__radio-btn:first-child {
    margin-left: 8px;
  }

  .od-fp-form__radio-btn input[type="radio"] {
    opacity: 0;
  }

  .od-fp-form__radio-btn label {
    font-size: 16px;
    line-height: 1;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    cursor: pointer;
    color: #ffffff;
  }

  .od-fp-form__radio-btn label:after {
    content: "";
    position: absolute;

    left: -30px;
    width: 15px;
    height: 15px;
    border-radius: 100%;
    background-color: var(--od-button-background);
    transition: 0.4s;
    opacity: 0;
  }

  .od-fp-form__radio-btn input[type="radio"]:checked + label:after {
    opacity: 1;
  }

  .od-fp-form__radio-btn label:before {
    content: "";
    position: absolute;
    left: -38px;
    top: -9px;
    width: 32px;
    height: 32px;
    border-radius: 16px;
    border: 1px solid #979797;
  }

  /* submit --- submit --- submit ---  */

  .od-fp-form__submit-wrapper {
    width: 100%;
    text-align: center;
  }

  .od-fp-form__submit {
    color: var(--od-button-text);
    background-color: var(--od-button-background);
    border: 1px solid var(--od-button-background);
    min-height: 60px;
    width: 280px;
    padding: 0 20px;
    border-radius: 30px;
    margin: 0 auto 20px;
    font-size: 18px;
  }

  .od-fp-form__submit:hover {
    color: var(--od-button-hover-background);
    background-color: var(--od-button-hover-background);
  }

  .od-fp-form__submit:focus {
    outline: none;
    border: 1px solid var(--od-button-hover-background);
  }

  /* cancel --- cancel --- cancel ---  */

  .od-fp-form__cancel-wrapper {
    width: 100%;
    text-align: center;
    margin-bottom: 40px;
  }

  .od-fp-form__cancel {
    color: var(--od-sent-message-text);
  }

  .od-fp-form__cancel,
  .od-fp-form__cancel:hover,
  .od-fp-form__cancel:focus {
    border: none;
    outline: none;
    background: none;
    text-decoration: underline;
  }

  @keyframes confirmCloseChatAnim {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  .confirmCloseChat {
    opacity: 0;
  }

  .confirmCloseChatAnimate {
    animation: confirmCloseChatAnim 0.6s forwards;
  }

  /* fp-loader --- fp-loader --- fp-loader ---  */

  .fp-loader {
    position: sticky;
    width: 100%;
    height: 100%;
    text-align: center;
    top: 0;
    bottom: 0;
    left: 0;
    background: rgba(0, 0, 0, 0.3);
  }
  .fp-loader svg {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
  }
  .fp-loader svg path {
    fill: var(--od-button-background)
  }
}
</style>
