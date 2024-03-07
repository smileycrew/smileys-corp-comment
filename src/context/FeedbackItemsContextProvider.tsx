import { createContext, useMemo, useState } from "react";
import { useFeedbackItems } from "../lib/hooks";
import { TFeedbackItem } from "../lib/types";

type FeedbackItemsContextProviderProps = {
    children: React.ReactNode
}

type TFeedbackItemsContext = {
    companyList: string[],
    errorMessage: string,
    filteredFeedbackItems: TFeedbackItem[],
    handleAddToList: (text: string) => void,
    handleSelectedCompany: (compnay: string) => void,
    isLoading: boolean,
}

export const FeedbackitemsContext = createContext<TFeedbackItemsContext | null>(null)

export default function FeedbackItemsContextProvider({ children }: FeedbackItemsContextProviderProps) {
    const { errorMessage, feedbackItems, isLoading, setFeedbackItems } = useFeedbackItems()

    const [selectedCompany, setSelectedCompany] = useState("")

    const companyList = useMemo(() => feedbackItems.map((item) => item.company).filter((company, index, array) => {
        return array.indexOf(company) === index
    }), [feedbackItems])

    const filteredFeedbackItems = useMemo(() => selectedCompany ? feedbackItems.filter((feedbackItem) => feedbackItem.company === selectedCompany) : feedbackItems, [feedbackItems, selectedCompany])

    const handleAddToList = async (text: string) => {
        const companyName = text.split(" ").find((word) => word.includes("#"))!.substring(1)

        const newItem: TFeedbackItem = {
            badgeLetter: companyName.substring(0, 1).toUpperCase(),
            company: companyName,
            daysAgo: 0,
            id: new Date().getTime(),
            text: text,
            upvoteCount: 0,
        }

        setFeedbackItems([...feedbackItems, newItem])

        await fetch("https://bytegrad.com/course-assets/projects/corpcomment/api/feedbacks", {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(newItem)
        })
    }

    const handleSelectedCompany = (company: string) => {
        setSelectedCompany(company)
    }

    return (
        <FeedbackitemsContext.Provider value={{
            companyList,
            errorMessage,
            filteredFeedbackItems,
            handleAddToList,
            handleSelectedCompany,
            isLoading,
        }}>{children}</FeedbackitemsContext.Provider>
    )
}