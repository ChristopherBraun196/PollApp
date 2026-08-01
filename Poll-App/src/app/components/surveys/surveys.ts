import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Survey } from '../../models/survey.model';
import { Supabase } from '../../services/supabase';

const daysFromNow = (days: number): Date => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date;
};

@Component({
  selector: 'app-surveys',
  imports: [RouterLink],
  templateUrl: './surveys.html',
  styleUrl: './surveys.scss',
})
export class Surveys {
  private supabase = inject(Supabase);
  private cdr = inject(ChangeDetectorRef);

  surveys: Survey[] = [];

  constructor() {
    this.supabase.client
      .from('surveys')
      .select('*')
      .then((result) => {
        if (result.error || !result.data) {
          console.log(result.error);
          return;
        }

        this.surveys = result.data.map((s: any) => ({
          id: s.id,
          title: s.title,
          category: s.category,
          endDate: s.end_date ? new Date(s.end_date) : undefined,
        }));

        this.cdr.detectChanges();
      });
  }

  get endingSurveys() {
    return [...this.surveys]
      .filter((s) => s.endDate)
      .sort((a, b) => a.endDate!.getTime() - b.endDate!.getTime())
      .slice(0, 3);
  }

  getDeadlineText(endDate?: Date): string {
    if (!endDate) {
      return '';
    }
    const days = Math.ceil((endDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    return days === 1 ? 'Ends in 1 Day' : `Ends in ${days} Days`;
  }
}
