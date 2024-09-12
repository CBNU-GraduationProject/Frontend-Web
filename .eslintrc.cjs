/* eslint-env node */
module.exports = {
  env: {
    browser: true, // 브라우저 환경을 추가
    node: true,    // Node.js 환경을 추가
  },
  extends: ["plugin:vue/vue3-essential", "eslint:recommended"],
  rules: {
    "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
    "vue/multi-word-component-names": "off",
  },
};
