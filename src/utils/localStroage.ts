export default class LocalStorage {

  /**
   * 往 localStroage 中存放数据
   * @param key key 值
   * @param value value 值
   */
  static set(key: string, value: object | string | number | boolean) {
    window.localStorage.setItem(key,JSON.stringify(value))
  }

  /**
   * 从 localStorage 中取出数据
   * @param key key 值
   * @returns 
   */
  static get<T>(key: string): T | null {
    const value = window.localStorage.getItem(key)
    if (value && value !== 'undefined' && value !== 'null') {
      return <T>JSON.parse(value)
    } else {
      return null
    }
  }

  /**
   * 从 localStroage 中删除数据
   * @param key key 值
   */
  static remove(key: string): void {
    window.localStorage.removeItem(key)
  }

}
