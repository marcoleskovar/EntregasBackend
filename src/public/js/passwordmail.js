const btn = document.getElementById('sendMail')

btn.onclick = async (e) => {
    e.preventDefault()
    const mail = document.getElementById('recoverMail').value
    const mailBody = {email: mail}
    await fetch(`/session/recover/mail`, {
        method: 'POST',
        body: JSON.stringify(mailBody),
        headers: {
            'Content-Type': 'application/json'
        }
    })
}