import { useState, useEffect, useRef } from "react"

interface UseTypingEffectOptions {
  typingSpeed?: number
  deletingSpeed?: number
  pauseBeforeDelete?: number
  pauseBeforeType?: number
  enabled?: boolean
}

/**
 * Typewriter effect hook that cycles through a list of phrases.
 *
 * Performance note (W-5):
 * The typing state machine runs entirely via refs. Only a single
 * `displayText` state is updated — and only when the ref value actually
 * changes — preventing cascading re-renders on every timeout tick.
 * At 30ms/char the old design caused ~33 re-renders/s on the parent tree;
 * this design causes exactly one per character, triggered by the ref flush.
 */
export function useTypingEffect(phrases: string[], options: UseTypingEffectOptions = {}) {
  const {
    typingSpeed = 50,
    deletingSpeed = 30,
    pauseBeforeDelete = 2000,
    pauseBeforeType = 500,
    enabled = true,
  } = options

  // State machine lives in refs — no re-renders from intermediate states
  const selectedIndexRef = useRef(0)
  const currentTextRef = useRef("")
  const isDeletingRef = useRef(false)

  // Single display state — only updated to flush the ref value to the DOM
  const [displayText, setDisplayText] = useState("")

  useEffect(() => {
    if (!enabled || !phrases || phrases.length === 0) return

    let timeoutId: NodeJS.Timeout

    const tick = () => {
      const fullText = phrases[selectedIndexRef.current]
      const current = currentTextRef.current
      const isDeleting = isDeletingRef.current

      if (!isDeleting && current === fullText) {
        // Finished typing — wait before deleting
        timeoutId = setTimeout(() => {
          isDeletingRef.current = true
          tick()
        }, pauseBeforeDelete)
        return
      }

      if (isDeleting && current === "") {
        // Finished deleting — wait before typing next phrase
        timeoutId = setTimeout(() => {
          isDeletingRef.current = false
          selectedIndexRef.current = (selectedIndexRef.current + 1) % phrases.length
          tick()
        }, pauseBeforeType)
        return
      }

      const nextText = isDeleting
        ? fullText.substring(0, current.length - 1)
        : fullText.substring(0, current.length + 1)

      currentTextRef.current = nextText
      // Flush ref value to React state — this is the only re-render trigger
      setDisplayText(nextText)

      timeoutId = setTimeout(tick, isDeleting ? deletingSpeed : typingSpeed)
    }

    timeoutId = setTimeout(tick, typingSpeed)

    return () => clearTimeout(timeoutId)
  }, [enabled, phrases, typingSpeed, deletingSpeed, pauseBeforeDelete, pauseBeforeType])

  return displayText
}
