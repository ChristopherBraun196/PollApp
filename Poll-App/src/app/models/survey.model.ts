export interface Answer {
  label: string;
  text: string;
  selected?: boolean;
}
export interface Question {
  legend: string;
  hint?: string;
  allowMultiple: boolean;
  answers: Answer[];
}
