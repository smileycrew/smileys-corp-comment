import { useContext, useEffect, useState } from "react"
import { FeedbackitemsContext } from "../context/FeedbackItemsContextProvider"
import { TFeedbackItem } from "./types"

export function useFeedbackItemsContext() {
  const context = useContext(FeedbackitemsContext)
  if (!context) {
    throw new Error(
      "FeedbackItemsContext is no defined in FeedbackList component"
    )
  }
  return context
}

export function useFeedbackItems() {
  const [feedbackItems, setFeedbackItems] = useState<TFeedbackItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  useEffect(() => {
    const fetchFeedbackItems = async () => {
      setIsLoading(true)

      try {
        const response = await fetch(
          "https://bytegrad.com/course-assets/projects/corpcomment/api/feedbacks"
        )

        if (!response.ok) {
          throw new Error()
        }

        const data = await response.json()

        setFeedbackItems(data.feedbacks)
      } catch (error) {
        setErrorMessage("Something went wrong. Please try again later.")
      }

      setIsLoading(false)
    }

    fetchFeedbackItems()
  }, [])

  return {
    errorMessage,
    feedbackItems,
    isLoading,
    setFeedbackItems,
  }
}
