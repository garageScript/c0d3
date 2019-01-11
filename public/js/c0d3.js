const joinButton = document.getElementById('joinButton');
const inviteCodeInput = document.getElementById('inviteCodeInput');

const startApp = () => {
  if (!joinButton || !inviteCodeInput) return;
  joinButton.onclick = () => {
    const inviteCode = inviteCodeInput.value;
    if (!inviteCode) return;
    document.getElementById('invalidFeedback').style.display = 'block';
    inviteCodeInput.style.borderColor = '#dc3545';
    /*
     * Uncomment when publicly released and beta is over
    fetch(`/join/${inviteCode}`)
      .catch(() => {
      })
      .then(() => {
      })
      */
  };
}

startApp();
