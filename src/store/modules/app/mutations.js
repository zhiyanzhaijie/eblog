import { CHANG_ISCOLLAPSE } from './constants'
const mutations = {
  [CHANG_ISCOLLAPSE](state) {
    state.isCollapse = !state.isCollapse
  },
}

export default mutations
