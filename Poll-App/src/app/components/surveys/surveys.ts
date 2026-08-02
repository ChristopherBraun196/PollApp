import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Survey } from '../../models/survey.model';
import { Supabase } from '../../services/supabase';

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

  activeTab: 'active' | 'past' = 'active';
  selectedCategory: string | null = null;
  categoryOpen = false;

  toggleCategoryDropdown() {
    this.categoryOpen = !this.categoryOpen;
  }

  setTab(tab: 'active' | 'past') {
    this.activeTab = tab;
  }

  selectCategory(category: string | null) {
    this.selectedCategory = category;
    this.categoryOpen = false;
  }

  constructor() {
    this.loadSurveys();
  }

  loadSurveys() {
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
    const now = Date.now();
    return [...this.surveys]
      .filter(
        (s) => s.endDate && Math.ceil((s.endDate.getTime() - now) / (1000 * 60 * 60 * 24)) >= 0,
      )
      .sort((a, b) => a.endDate!.getTime() - b.endDate!.getTime())
      .slice(0, 3);
  }

  get filteredSurveys() {
    const now = Date.now();

    let result = this.surveys.filter((s) => {
      const isPast = s.endDate
        ? Math.ceil((s.endDate.getTime() - now) / (1000 * 60 * 60 * 24)) < 0
        : false;
      return this.activeTab === 'past' ? isPast : !isPast;
    });

    if (this.selectedCategory) {
      result = result.filter((s) => s.category === this.selectedCategory);
    }

    if (this.activeTab === 'active') {
      result = [...result].sort((a, b) => {
        if (!a.endDate) return 1;
        if (!b.endDate) return -1;
        return a.endDate.getTime() - b.endDate.getTime();
      });
    }
    return result;
  }

  getDeadlineText(endDate?: Date): string {
    if (!endDate) {
      return 'No deadline';
    }
    const days = Math.ceil((endDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    if (days < 0) {
      const daysAgo = Math.abs(days);
      return 'Ended';
    }
    if (days === 0) return 'Ends today';

    return days === 1 ? 'Ends in 1 Day' : `Ends in ${days} Days`;
  }
}
