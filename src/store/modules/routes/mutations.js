import { SET_ROUTES, REMOVE_ROUTES } from './constants'
const mutations = {
  [SET_ROUTES](state, routes) {
    state.routes = routes
  },
  [REMOVE_ROUTES](state) {
    state.routes = []
  },
}
export default mutations
