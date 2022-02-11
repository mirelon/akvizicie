export function speak(description) {
    const msg = new SpeechSynthesisUtterance(description)
    const voice = speechSynthesis.getVoices().filter(x => x.lang === 'sk-SK')[0]
    console.log(`Speak ${description}, voice = ${voice}`)
    if (voice) {
        msg.voice = voice
        console.log(`Speak ${description}`)
        speechSynthesis.speak(msg)
    }
}

export function domAndSpeechLoaded(f) {
    let initialized = {
        dom: false,
        speech: false
    }

    window.addEventListener('DOMContentLoaded', () => {
        console.log('DOM loaded')
        initialized.dom = true
        checkInit()
    })

    speechSynthesis.addEventListener("voiceschanged", () => {
        console.log('Speech loaded')
        initialized.speech = true
        checkInit()
    })

    function checkInit() {
        if (initialized.dom && initialized.speech) {
            speechSynthesis.cancel()
            f()
        }
    }
}
