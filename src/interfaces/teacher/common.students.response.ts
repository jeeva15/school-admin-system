export type CommonStudentsResponse = {
  students?: StudentEmail[];
  message?: string; // when student not found
};

export type StudentEmail = string;
