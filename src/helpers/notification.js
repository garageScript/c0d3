/* global localStorage, alert, Notification */

const appData = JSON.parse(localStorage.getItem('c0d3') || '{}')

const notify = text => {
  // Show user info only if user is logged in
  if (!appData.beenAlerted && window.userInfo && window.userInfo.name) {
    appData.beenAlerted = true
    alert(
      'To properly see notifications for reviews to your submissions and chat responses to your questions, please allow browser notifications when your browser prompts for it. You can disable it anytime in your browser settings.'
    )
    Notification.requestPermission()
    localStorage.setItem('c0d3', JSON.stringify(appData))
    return
  }

  if (Notification.permission !== 'granted') return
  const notification = new Notification('New Message', {
    body: text,
    icon: 'https://c0d3.com/images/smallLogo.png'
  })
  setTimeout(notification.close.bind(notification), 4000)
}

window.notify = notify

export default notify
