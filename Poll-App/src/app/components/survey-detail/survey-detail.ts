import { Component, inject, signal, viewChild, ChangeDetectorRef } from '@angular/core';
import { NewSurvey } from '../new-survey/new-survey';
import { Question, Answer, Survey } from '../../models/survey.model';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Supabase } from '../../services/supabase';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-survey-detail',
  imports: [NewSurvey, RouterLink, DatePipe],
  templateUrl: './survey-detail.html',
  styleUrl: './survey-detail.scss',
})
export class SurveyDetail {
  newSurveyDialog = viewChild(NewSurvey);

  private route = inject(ActivatedRoute);
  private supabase = inject(Supabase);
  private cdr = inject(ChangeDetectorRef);
  private router = inject(Router);

  questions: Question[] = [];
  survey?: Survey;
  resultsOpen = signal(true);

  get isPast(): boolean {
    if (!this.survey?.endDate) {
      return false;
    }
    return Math.ceil((this.survey.endDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)) < 0;
  }

  openDialog() {
    this.newSurveyDialog()?.open();
  }

  toggleResults(){
    this.resultsOpen.update((open) => !open);
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

  async completeSurvey() {
    for (const question of this.questions) {
      for (const answer of question.answers) {
        if (answer.selected && answer.id) {
          const { error } = await this.supabase.client
            .from('votes')
            .insert({ answer_id: answer.id });
        }
      }
    }

    this.loadResults();
  }

  loadResults() {
    const answerIds = this.questions.flatMap((q) => q.answers.map((a) => a.id));

    this.supabase.client
      .from('votes')
      .select('answer_id')
      .in('answer_id', answerIds)
      .then((votesResult) => {
        if (votesResult.error || !votesResult.data) {
          return;
        }

        const counts: Record<number, number> = {};
        for (const vote of votesResult.data) {
          counts[vote.answer_id] = (counts[vote.answer_id] || 0) + 1;
        }

        for (const question of this.questions) {
          const totalVotes = question.answers.reduce((sum, a) => sum + (counts[a.id!] || 0), 0);
          question.totalVotes = totalVotes;

          for (const answer of question.answers) {
            const voteCount = counts[answer.id!] || 0;
            answer.votePercentage = totalVotes > 0 ? Math.round((voteCount / totalVotes) * 100) : 0;
          }
        }

        this.cdr.detectChanges();
      });
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
          this.router.navigateByUrl('/not-found', { skipLocationChange: true });
          return;
        }

        this.survey = {
          id: result.data.id,
          title: result.data.title,
          category: result.data.category,
          description: result.data.description,
          endDate: result.data.end_date ? new Date(result.data.end_date) : undefined,
        };

        this.questions = result.data.questions.map((q: any) => ({
          legend: q.text,
          hint: q.hint,
          allowMultiple: q.allow_multiple,
          answers: q.answers.map((a: any) => ({
            id: a.id,
            label: a.label,
            text: a.text,
          })),
        }));

        this.loadResults();
      });
  }
}
