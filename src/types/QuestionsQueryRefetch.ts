interface QuizzesQueryRefetch {
  page: number;
  question?: string;
  quiz_id: number | null;
  first?: number;
}

export default QuizzesQueryRefetch;
