module.exports = {
  css: {
    loaderOptions: {
      sass: {
        // 全局引入变量和mixin sass 版本 9 中使用 additionalData 版本 8 中使用 prependData
        prependData: `
          @import "@/assets/scss/variable.scss";
          @import "@/assets/scss/mixin.scss";
        `
      }
    }
  }
}