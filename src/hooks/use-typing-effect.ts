import { useState, useEffect } from "react"

interface UseTypingEffectOptions {
  typingSpeed?: number
  deletingSpeed?: number
  pauseBeforeDelete?: number
  pauseBeforeType?: number
}

export function useTypingEffect(phrases: string[], options: UseTypingEffectOptions = {}) {
  const { typingSpeed = 50, deletingSpeed = 30, pauseBeforeDelete = 2000, pauseBeforeType = 500 } = options

  const [selectedIndex, setSelectedIndex] = useState(0)
  const [currentText, setCurrentText] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    if (!phrases || phrases.length === 0) return

    const fullText = phrases[selectedIndex]
    let timeoutId: NodeJS.Timeout

    if (!isDeleting && currentText === fullText) {
      timeoutId = setTimeout(() => setIsDeleting(true), pauseBeforeDelete)
    } else if (isDeleting && currentText === "") {
      timeoutId = setTimeout(() => {
        setIsDeleting(false)
        setSelectedIndex((prev) => (prev + 1) % phrases.length)
      }, pauseBeforeType)
    } else {
      timeoutId = setTimeout(
        () => {
          setCurrentText(
            isDeleting ? fullText.substring(0, currentText.length - 1) : fullText.substring(0, currentText.length + 1)
          )
        },
        isDeleting ? deletingSpeed : typingSpeed
      )
    }

    return () => clearTimeout(timeoutId)
  }, [currentText, isDeleting, selectedIndex, phrases, typingSpeed, deletingSpeed, pauseBeforeDelete, pauseBeforeType])

  return currentText
}
