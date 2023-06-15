interface Answer {
  id: number | null;
  answer: string;
  is_correct?: boolean;
  question_id?: number;
}

export default Answer;
