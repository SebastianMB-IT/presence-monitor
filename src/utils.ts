/**
 * Retrieve the user status checking the associated extenions
 * @param extensions The extensions of the user
 * @returns
 */
export const getStatusOfUser = function (extensions) {
  var statuses: string[] = []
  extensions.forEach((ext) => {
    statuses.push(ext.status)
  })
  if (statuses.indexOf('busy') > -1) {
    return 'busy'
  } else if (statuses.indexOf('busy_ringing') > -1) {
    return 'busy_ringing'
  } else if (statuses.indexOf('ringing') > -1) {
    return 'ringing'
  } else if (statuses.indexOf('onhold') > -1) {
    return 'onhold'
  } else if (statuses.indexOf('online') > -1) {
    return 'online'
  } else {
    return 'offline'
  }
}
