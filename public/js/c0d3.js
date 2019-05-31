const joinButton = document.getElementById('joinButton')
const emailInput = document.getElementById('emailInput')
const invalidFeedback = document.getElementById('invalidFeedback')
const validFeedback = document.getElementById('validFeedback')

const startApp = () => {
  if (!joinButton || !emailInput) return
  joinButton.onclick = () => {
    if (!emailInput.value) {
      invalidFeedback.innerHTML = 'Please Enter an Email Address'
      return document.getElementById('invalidFeedback').style.display = 'block'
    }
    fetch('https://petecs.c0d3.com/waitlist', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({
        email: `${emailInput.value}`
      })
    })
      .then(response => response.json())
      .then(response => {
        if (response.inUserTable) {
          invalidFeedback.innerHTML = 'This email is already registered to a c0d3.com user'
          emailInput.style.borderColor = '#dc3545'
          validFeedback.style.display = 'none'
          return invalidFeedback.style.display = 'block'
        }
        if (response.inWaitListTable) {
          invalidFeedback.innerHTML = 'This email is already on the waitlist.  Sit tight, your coding journey will begin shortly!'
          emailInput.style.borderColor = '#dc3545'
          validFeedback.style.display = 'none'
          return invalidFeedback.style.display = 'block'
        }
        if (response.waitListSuccess) {
          emailInput.style.borderColor = '#00c851'
          invalidFeedback.style.display = 'none'
          return validFeedback.style.display = 'block'
        }
      })
      .catch(error => console.log(error))
  }
}

startApp()
