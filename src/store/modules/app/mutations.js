import {
  CHANG_ISCOLLAPSE,
  SET_TOKEN,
  SET_USERINFO,
  SET_USER_ID,
} from './constants'
import { setToken, setUserId } from '@/utils/storage'
const mutations = {
  [CHANG_ISCOLLAPSE](state) {
    state.isCollapse = !state.isCollapse
  },
  [SET_TOKEN](state, Token) {
    state.Token = Token
    setToken(Token)
  },
  [SET_USER_ID](state, id) {
    state.userId = id
    setUserId(id)
  },
  [SET_USERINFO](state, data) {
    state.userInfo = data
  },
}

export default mutations
