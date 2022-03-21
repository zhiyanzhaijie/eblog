import { getToken, getUserId } from '@/utils/storage'

const getters = {
  isCollapse: (state) => state.isCollapse,
  Token: (state) => {
    return state.Token || getToken()
  },
  userId: (state) => {
    return state.userId || getUserId()
  },
  userInfo: (state) => {
    return state.userInfo
  },
}

export default getters
