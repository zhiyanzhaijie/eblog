import { userLogin, getUserInfo } from '@/api/app'
import {
  CHANG_ISCOLLAPSE,
  USER_LOGIN,
  SET_TOKEN,
  SET_USER_ID,
  SET_USERINFO,
  USER_LOGOUT,
} from './constants'
const actions = {
  [CHANG_ISCOLLAPSE]({ commit }) {
    commit(CHANG_ISCOLLAPSE)
  },
  [USER_LOGIN]({ commit }, data) {
    return new Promise((resolve, reject) => {
      userLogin(data)
        .then(async (res) => {
          // 无异常即登录成功，Token和userId持久化
          await commit(SET_TOKEN, res.data.Token)
          await commit(SET_USER_ID, res.data.id)
          resolve(res)
        })
        .catch((e) => {
          reject(e)
        })
    })
  },
  [SET_USERINFO]({ commit }, id) {
    return new Promise((resolve, reject) => {
      getUserInfo(id)
        .then((res) => {
          commit(SET_USERINFO, res.data)
          resolve(res)
        })
        .catch((e) => {
          reject(e)
        })
    })
  },
  [USER_LOGOUT]({ commit }) {
    commit(SET_TOKEN, '')
    commit(SET_USER_ID, '')
    commit(SET_USERINFO, {})
  },
}

export default actions
