import { Component, inject, viewChild } from '@angular/core';
import { NewSurvey } from '../new-survey/new-survey';
import { Question, Answer } from '../../models/survey.model';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Supabase } from '../../services/supabase';

@Component({
  selector: 'app-survey-detail',
  imports: [NewSurvey, RouterLink],
  templateUrl: './survey-detail.html',
  styleUrl: './survey-detail.scss',
})
export class SurveyDetail {
  newSurveyDialog = viewChild(NewSurvey);

  private route = inject(ActivatedRoute);
  private supabase = inject(Supabase);

  questions: Question[] = [];

  openDialog() {
    this.newSurveyDialog()?.open();
  }

  toggleAnswer(question: Question, answer: Answer) {
    const wasSelected = !!answer.selected;

    if (!question.allowMultiple) {
      for (const a of question.answers) {
        a.selected = false;
      }
    }
    answer.selected = !wasSelected;
  }

  completeSurvey() {
    console.log(this.questions);
  }

  constructor() {
    const surveyId = this.route.snapshot.paramMap.get('id');

    this.supabase.client
      .from('surveys')
      .select('*, questions(*, answers(*))')
      .eq('id', surveyId)
      .single()
      .then((result) => {
        if (result.error || !result.data) {
          console.log(result.error);
          return;
        }

        this.questions = result.data.questions.map((q: any) => ({
          legend: q.text,
          hint: q.hint,
          allowMultiple: q.allow_multiple,
          answers: q.answers.map((a: any) => ({
            label: a.label,
            text: a.text,
          })),
        }));
      });
  }
}
