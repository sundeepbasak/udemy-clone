import { API_URL } from "@/constants/url";
import Link from "next/link";
import { Stringifier } from "postcss";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  MessageCircle,
  MessageCircleIcon,
  MessageSquare,
  MessageSquareDashedIcon,
  Reply,
} from "lucide-react";
import { Button } from "../ui/button";

const QuestionAnswerList = ({
  questionAnswers,
  courseId,
  onDiscussionReply,
  toggleForm,
}: {
  courseId: string;
  questionAnswers: any;
  onDiscussionReply: any;
  toggleForm: any;
}) => {
  // const [questionAnswers, setQuestionAnswers] = useState<any[]>([])

  // useEffect(() => {
  //   const fetchQuestionAnswers = async () => {
  //     const res = await fetch(`${API_URL}/course/${courseId}/discussion`)

  //     if (res.ok) {
  //       const data = await res.json()
  //       console.log('GET discussion', data)
  //       setQuestionAnswers(data.data)
  //     } else {
  //       console.error('Discucssion error')
  //     }
  //   }

  //   fetchQuestionAnswers()
  // }, [courseId])

  return (
    <div className="w-3/5">
      <div className="flex justify-between items-center mb-3">
        <h4 className="text-xl font-light mb-3">
          All question in this Lecture
        </h4>
        <Button size="sm" variant="outline" onClick={toggleForm}>
          Ask a question
        </Button>
      </div>
      {questionAnswers.length < 1 && (
        <div className="pl-2">No questions raised</div>
      )}
      <ul className="w-full pl-2">
        {questionAnswers &&
          questionAnswers.map((item: any) => (
            <li key={item.id} className="flex items-start mb-3 p-2 rounded-md">
              <Avatar className="mr-3">
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <div>
                <h5
                  className="font-semibold text-lg cursor-pointer"
                  onClick={() => onDiscussionReply(item.id)}
                >
                  {item.qn_title}
                </h5>
                <p className="text-sm">{item.qn_detail}</p>
              </div>
              <button
                onClick={() => onDiscussionReply(item.id)}
                className="ml-auto"
              >
                <MessageSquare />
              </button>
            </li>
          ))}
      </ul>
    </div>
  );
};

export default QuestionAnswerList;
