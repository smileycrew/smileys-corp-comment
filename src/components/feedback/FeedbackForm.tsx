import { useState } from "react"
import { MAX_CHARACTERS } from "../../lib/constants"

type FeedbackFormProps = {
    onAddToList: (text: string) => void

}

export default function FeedbackForm({ onAddToList }: FeedbackFormProps) {
    const [text, setText] = useState("")
    const [showValidIndicator, setShowValidIndicator] = useState(false)
    const [showInvalidIndicator, setShowInvalidIndicator] = useState(false)

    const charCount = MAX_CHARACTERS - text.length

    const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newText = event.target.value

        if (newText.length > MAX_CHARACTERS) {
            return
        }

        setText(newText)
    }

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        // basic validation
        if (text.includes("#") && text.length >= 5) {
            setShowValidIndicator(true)
            setTimeout(() => setShowValidIndicator(false), 2000)
        } else {
            setShowInvalidIndicator(true)
            setTimeout(() => setShowInvalidIndicator(false), 2000)
            return
        }

        onAddToList(text)

        setText("")
    }

    return (
        <form className={`form ${showValidIndicator && "form--valid"} ${showInvalidIndicator && "form--invalid"}`} onSubmit={handleSubmit}>
            <textarea id="feedback-textarea" onChange={handleChange} placeholder="text"
                spellCheck={false} value={text} />

            <label htmlFor="feedback-textarea">
                Enter your feedback here, remember to #hashtag the company
            </label>

            <div>
                <p className="u_italic">{charCount}</p>

                <button>
                    <span>Submit</span>
                </button>
            </div>
        </form>
    )
}
