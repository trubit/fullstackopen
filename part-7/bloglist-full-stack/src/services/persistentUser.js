const STORAGE_KEY = 'loggedBlogappUser'

const getUser = () => {
  const serializedUser = window.localStorage.getItem(STORAGE_KEY)

  if (!serializedUser) {
    return null
  }

  try {
    return JSON.parse(serializedUser)
  } catch {
    return null
  }
}

const saveUser = (user) => {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
}

const removeUser = () => {
  window.localStorage.removeItem(STORAGE_KEY)
}

export default { getUser, saveUser, removeUser }
