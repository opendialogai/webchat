<template>
  <div
    class="mt-fp-form"
    :class="{ loader: showLoader }"
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
    <div class="mt-fp-form__elements">
      <div class="mt-fp-form__title" v-html="message.data.text"></div>

      <div
        v-for="element in message.data.elements"
        class="mt-fp-form__element"
        :class="element.name"
      >
        <span
          v-if="element.display"
          class="mt-fp-form__label"
          :class="[
          { 'mt-fp-form__label--radio' : element.element_type == 'radio'},
          { 'mt-fp-form__label--error' : errors.find(x => x.type === element.name)}
          ]"
        >{{ element.display }}</span>

        <!-- <div v-if="errors.length"> -->

        <!-- </div> -->

        <template v-if="element.element_type == 'text'">
          <input
            type="text"
            class="mt-fp-form__input"
            v-model="form.data[element.name].value"
            v-on:keyup.enter="_handleClick"
            :class="{ 'mt-fp-form__input--error' : errors.find(x => x.type === element.name)}"
          />

          <!-- 👇🏻 This creates an error element if you need it  -->
          <!-- <div v-for="error in errors">
            <div v-if="error.type == element.name" v-html="error.message" class="mt-fp-form__error"></div>
          </div>-->
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
                name="radio"
                type="radio"
                v-bind:id="radio_value"
                v-bind:value="radio_value"
                v-model="form.data[element.name].value"
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

      <div class="mt-fp-form__submit-wrapper">
        <button
          class="mt-fp-form__submit"
          v-if="!message.data.auto_submit"
          @click="_handleClick"
        >{{ message.data.submit_text }}</button>
      </div>

      <div
        v-if="message.data.cancel_text && message.data.cancel_callback"
        class="mt-fp-form__cancel-wrapper"
      >
        <button class="mt-fp-form__cancel" @click="_handleCancel">{{ message.data.cancel_text }}</button>
      </div>
    </div>

    <template v-if="showLoader">
      <div class="fp-loader">
        <img src="./assets/fp-loader.svg" />
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
    onSubmit: {
      type: Function,
      required: true
    },
    onCancel: {
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
      this.showLoader = false;
    },
  },
  methods: {
    onSelectChange() {
      if (this.message.data.auto_submit) {
        this._handleClick();
      }
    },
    _handleCancel() {
      this.onCancel(this.form.data);
    },
    _handleClick() {
      if (!this.showLoader) {
        this.validateForm();
        if (!this.errors.length) {
          this.onSubmit(this.form.data);

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
              message:
                "<em>" +
                element.display +
                "</em> field is not a valid email address"
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
  width: 100%;
  text-align: center;
}

/* form --- form --- form ---  */

.mt-fp-form {
  background-color: var(--messageListBg);
  overflow-x: hidden;
  position: relative;
  flex: 1;
}
.mt-fp-form.loader {
  overflow-y: hidden;
}

.mt-fp-form__elements {
  width: 90%;
  margin: 0 auto;
  flex: 1;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  padding-top: 20px;
  overflow-y: auto;
}

.mt-fp-form__element {
  position: relative;
  width: 100%;
  margin: 0 auto 18px;
}

/* 🔥 avaya - custom css 🔥 */
/* 🔥 avaya - custom css 🔥 */

.first_name,
.last_name {
  width: 47%;
  padding: 0;
  margin: 0 0 18px;
}

/* 🔥 avaya - custom css 🔥 */
/* 🔥 avaya - custom css 🔥 */

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
  background-color: transparent;
}

.mt-fp-form__label--error {
  color: var(--btn-bg);
}

.mt-fp-form__label--error:before {
  content: "*";
}

.mt-fp-form__label--error:after {
  /* content: " Required"; */
}

/* input --- input --- input ---  */

.mt-fp-form__input {
  border-radius: 4px;
  border: solid 1px #979797;
  height: 40px;
  padding: 0 10px;
  width: 100%;
}

.mt-fp-form__input--error {
  /* outline: none; */
  /* border: 1px solid var(--btn-bg); */
}

.mt-fp-form__input:focus {
  outline: none;
  border: 1px solid var(--btn-bg);
}

/* textarea -- */
.mt-fp-form__textarea {
  height: 100px;
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
  margin: 20px auto 20px;
  padding: 0 0 0 30px;
}

.mt-fp-form__radio-btn {
  margin-right: 22px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;

  width: 80px;
}

.mt-fp-form__radio-btn:first-child {
  margin-left: 8px;
}

.mt-fp-form__radio-btn input[type="radio"] {
  opacity: 0;
}

.mt-fp-form__radio-btn label {
  font-size: 16px;
  line-height: 1;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  cursor: pointer;
}

.mt-fp-form__radio-btn label:after {
  content: "";
  position: absolute;

  left: -30px;
  width: 15px;
  height: 15px;
  border-radius: 100%;
  background-color: #da291c;
  transition: 0.4s;
  opacity: 0;
}

.mt-fp-form__radio-btn input[type="radio"]:checked + label:after {
  opacity: 1;
}

.mt-fp-form__radio-btn label:before {
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

.mt-fp-form__submit-wrapper {
  width: 100%;
  text-align: center;
}

.mt-fp-form__submit {
  color: var(--btn-text-color);
  background-color: var(--btn-bg);
  min-height: 60px;
  width: 280px;
  padding: 0 20px;
  border-radius: 30px;
  margin: 0 auto 20px;
  font-size: 18px;
}

.mt-fp-form__submit:hover {
  color: var(--btn-text-color-hover);
  background-color: var(--btn-bg-hover);
}

.mt-fp-form__submit:focus {
  outline: none;
  border: 1px solid var(--btn-bg-hover);
}

/* cancel --- cancel --- cancel ---  */

.mt-fp-form__cancel-wrapper {
  width: 100%;
  text-align: center;
  margin-bottom: 40px;
}

.mt-fp-form__cancel,
.mt-fp-form__cancel:hover,
.mt-fp-form__cancel:focus {
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
.fp-loader img {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
}
</style>
