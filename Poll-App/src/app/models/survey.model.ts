export interface Answer {
  id?: number;
  label: string;
  text: string;
  selected?: boolean;
  votePercentage?: number;
}
export interface Question {
  legend: string;
  hint?: string;
  allowMultiple: boolean;
  answers: Answer[];
}

export interface Survey {
  id: number;
  category: string;
  title: string; 
  endDate?: Date; 
  description?: string;

}