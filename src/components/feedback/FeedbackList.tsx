import FeedbackItem from "./FeedbackItem";
import Spinner from "../Spinner";
import ErrorMessage from "../ErrorMessage";
import { useFeedbackItemsStore } from "../../stores/feedbackItemsStore";

export default function FeedbackList() {
    const errorMessage = useFeedbackItemsStore((state) => state.errorMessage)
    const filteredFeedbackItems = useFeedbackItemsStore((state) => state.getFilteredFeedbackItems())
    const isLoading = useFeedbackItemsStore((state) => state.isLoading)

    return (
        <ol className="feedback-list">
            {isLoading && < Spinner />}

            {errorMessage && <ErrorMessage message={errorMessage} />}

            {filteredFeedbackItems.map((feedbackItem) => (
                <FeedbackItem feedbackItem={feedbackItem} key={feedbackItem.id} />
            ))}
        </ol>
    )
}
