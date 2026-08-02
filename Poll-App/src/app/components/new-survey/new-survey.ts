import { Component, ElementRef, inject, signal, viewChild, output } from '@angular/core';
import { FormArray, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Supabase } from '../../services/supabase';

@Component({
  selector: 'app-new-survey',
  imports: [ReactiveFormsModule],
  templateUrl: './new-survey.html',
  styleUrl: './new-survey.scss',
})
export class NewSurvey {
  surveyCreated = output<void>();

  dialogRef = viewChild<ElementRef<HTMLDialogElement>>('newSurveyDialog');
  toastEl = viewChild<ElementRef<HTMLDivElement>>('toastEl');
  publishBtn = viewChild<ElementRef<HTMLButtonElement>>('publishBtn');
  private fb = inject(FormBuilder);
  categoryOpen = signal(false);

  private supabase = inject(Supabase);

  open() {
    this.dialogRef()?.nativeElement.showModal();
  }

  close() {
    this.dialogRef()?.nativeElement.close();
  }

  showToast() {
    const toast = this.toastEl()?.nativeElement;
    const btn = this.publishBtn()?.nativeElement;
    if (!toast || !btn) {
      return;
    }

    const rect = btn.getBoundingClientRect();
    toast.style.top = rect.top + 'px';
    toast.style.left = rect.left + 'px';

    (toast as any).showPopover();
  }

  hideToast() {
    (this.toastEl()?.nativeElement as any)?.hidePopover();
  }

  onDialogClose() {
    this.categoryOpen.set(false);

    while (this.questions.length > 1) {
      this.questions.removeAt(this.questions.length - 1);
    }

    const firstQuestionAnswers = this.getAnswers(0);
    while (firstQuestionAnswers.length > 2) {
      firstQuestionAnswers.removeAt(firstQuestionAnswers.length - 1);
    }

    this.surveyForm.reset();
    this.surveyForm.markAsUntouched();
  }

  surveyForm = this.fb.group({
    surveyName: ['', [Validators.required, Validators.minLength(5)]],
    endDate: [''],
    description: [''],
    category: ['', Validators.required],
    questions: this.fb.array([this.createQuestion()]),
  });

  get questions() {
    return this.surveyForm.get('questions') as FormArray;
  }

  toggleCategory() {
    if (this.categoryOpen()) {
      this.surveyForm.get('category')?.markAsTouched();
    }
    this.categoryOpen.update((open) => !open);
  }

  selectCategory(category: string) {
    this.surveyForm.get('category')?.setValue(category);
    this.categoryOpen.set(false);
  }

  createAnswer() {
    return this.fb.group({
      answerText: ['', Validators.required],
    });
  }

  createQuestion() {
    return this.fb.group({
      questionText: ['', [Validators.required, Validators.minLength(5)]],
      allowMultiple: [false],
      answers: this.fb.array([this.createAnswer(), this.createAnswer()]),
    });
  }

  addQuestion() {
    if (this.questions.length < 4) {
      this.questions.push(this.createQuestion());
    }
  }

  removeQuestion(index: number) {
    if (index === 0) {
      this.questions.at(0).reset();
    } else {
      this.questions.removeAt(index);
    }
  }

  getAnswers(questionIndex: number) {
    return this.questions.at(questionIndex).get('answers') as FormArray;
  }

  addAnswer(questionIndex: number) {
    const answers = this.getAnswers(questionIndex);
    if (answers.length < 6) {
      answers.push(this.createAnswer());
    }
  }

  removeAnswer(questionIndex: number, answerIndex: number) {
    if (questionIndex === 0 && answerIndex < 2) {
      this.getAnswers(0).at(answerIndex).reset();
    } else {
      this.getAnswers(questionIndex).removeAt(answerIndex);
    }
  }

  getLetter(index: number) {
    return String.fromCharCode(65 + index);
  }

  async saveQuestions(surveyId: number) {
    for (let i = 0; i < this.questions.length; i++) {
      const question = this.questions.at(i);
      const { data: savedQuestion, error: questionError } = await this.supabase.client
        .from('questions')
        .insert({
          survey_id: surveyId,
          text: question.value.questionText,
          allow_multiple: question.value.allowMultiple,
          position: i,
        })
        .select()
        .single();

      if (savedQuestion) {
        await this.saveAnswers(savedQuestion.id, this.getAnswers(i));
      }
    }
  }

  async saveAnswers(questionId: number, answers: FormArray) {
    for (let i = 0; i < answers.length; i++) {
      const answer = answers.at(i);
      const { error: answerError } = await this.supabase.client
        .from('answers')

        .insert({
          question_id: questionId,
          label: this.getLetter(i),
          text: answer.value.answerText,
          position: i,
        });
    }
  }

  async saveSurvey() {
    this.surveyForm.markAllAsTouched();
    if (this.surveyForm.invalid) {
      return;
    }
    const { data: survey, error } = await this.supabase.client
      .from('surveys')
      .insert({
        title: this.surveyForm.value.surveyName,
        description: this.surveyForm.value.description,
        category: this.surveyForm.value.category,
        end_date: this.surveyForm.value.endDate || null,
      })
      .select()
      .single();

    if (error || !survey) {
      return;
    }
    await this.saveQuestions(survey.id);
    this.surveyCreated.emit();
    this.showToast();
    setTimeout(() => {
      this.hideToast();
      this.close();
    }, 2000);
  }
}
