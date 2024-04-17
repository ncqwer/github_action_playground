const $libraryName = 'cw_test_www'

const UtilsLogics = {}
import aaa from './aaa'
// LOGIC IMPORTS

UtilsLogics.install = function (Vue, option = {}) {
    Vue.prototype.$library = Vue.prototype.$library || {}
    Vue.prototype.$library[`${$libraryName}`] = {}
    Vue.prototype.$library[`${$libraryName}`].aaa=aaa
    // LOGIC USE
}

export default UtilsLogics