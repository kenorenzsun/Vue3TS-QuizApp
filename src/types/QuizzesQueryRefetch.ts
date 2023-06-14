interface QuizzesQueryRefetch {
  page: number;
  name?: string;
  category_id: number | null;
  first?: number;
}

export default QuizzesQueryRefetch;
