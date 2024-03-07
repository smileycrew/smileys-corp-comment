import { create } from "zustand"
import { TFeedbackItem } from "../lib/types"
type Store = {
  addItemToList: (text: string) => Promise<void>
  errorMessage: string
  feedbackItems: TFeedbackItem[]
  fetchFeedbackItems: () => Promise<void>
  getCompanyList: () => string[]
  getFilteredFeedbackItems: () => TFeedbackItem[]
  isLoading: boolean
  selectCompany: (company: string) => void
  selectedCompany: string
}
export const useFeedbackItemsStore = create<Store>((set, get) => ({
  feedbackItems: [],
  isLoading: false,
  errorMessage: "",
  selectedCompany: "",
  getCompanyList: () => {
    return get()
      .feedbackItems.map((item) => item.company)
      .filter((company, index, array) => {
        return array.indexOf(company) === index
      })
  },
  getFilteredFeedbackItems: () => {
    const state = get()

    return state.selectedCompany
      ? state.feedbackItems.filter(
          (feedbackItem) => feedbackItem.company === state.selectedCompany
        )
      : state.feedbackItems
  },
  addItemToList: async (text: string) => {
    const companyName = text
      .split(" ")
      .find((word) => word.includes("#"))!
      .substring(1)

    const newItem: TFeedbackItem = {
      badgeLetter: companyName.substring(0, 1).toUpperCase(),
      company: companyName,
      daysAgo: 0,
      id: new Date().getTime(),
      text: text,
      upvoteCount: 0,
    }

    set((state) => ({
      feedbackItems: [...state.feedbackItems, newItem],
    }))

    await fetch(
      "https://bytegrad.com/course-assets/projects/corpcomment/api/feedbacks",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newItem),
      }
    )
  },
  selectCompany: (company: string) => {
    set(() => ({
      selectedCompany: company,
    }))
  },
  fetchFeedbackItems: async () => {
    set(() => ({
      isLoading: true,
    }))

    try {
      const response = await fetch(
        "https://bytegrad.com/course-assets/projects/corpcomment/api/feedbacks"
      )

      if (!response.ok) {
        throw new Error()
      }

      const data = await response.json()
      set(() => ({
        feedbackItems: data.feedbacks,
      }))
    } catch (error) {
      set(() => ({
        errorMessage: "Something went wrong. Please try again later.",
      }))
    }

    set(() => ({
      isLoading: false,
    }))
  },
}))
