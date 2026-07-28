import { Component, ElementRef, inject, signal, viewChild } from '@angular/core';
import { FormArray, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-new-survey',
  imports: [ReactiveFormsModule],
  templateUrl: './new-survey.html',
  styleUrl: './new-survey.scss',
})
export class NewSurvey {
  logFormValue() {
    // alert('Button wurde geklickt!');
    console.log(this.surveyForm.value);
  }

  dialogRef = viewChild<ElementRef<HTMLDialogElement>>('newSurveyDialog');
  private fb = inject(FormBuilder);
  categoryOpen = signal(false);

  open() {
    this.dialogRef()?.nativeElement.showModal();
  }

  close() {
    this.dialogRef()?.nativeElement.close();
  }

  onDialogClose() {
    this.categoryOpen.set(false);
    this.surveyForm.reset();
    this.questions.clear();
    this.questions.push(this.createQuestion());
  }

  surveyForm = this.fb.group({
    surveyName: ['', [Validators.required, Validators.minLength(5)]],
    endDate: [''],
    description: [''],
    category: [''],
    questions: this.fb.array([this.createQuestion()]),
  });

  get questions(){
    return this.surveyForm.get('questions') as FormArray;
  }

  toggleCategory() {
    this.categoryOpen.update((open) => !open);
  }

  selectCategory(category: string) {
    this.surveyForm.get('category')?.setValue(category);
    this.categoryOpen.set(false);
  }

  createAnswer() {
    return this.fb.group({
      answerText: [''],
    });
  }

  createQuestion() {
    return this.fb.group({
      questionText: [''],
      allowMultiple: [false],
      answers: this.fb.array([this.createAnswer(), this.createAnswer()]),
    });
  }

  addQuestion(){
    if (this.questions.length < 4) {
      this.questions.push(this.createQuestion());
    }
  }

  removeQuestion(index: number){
    if (index === 0) {
      this.questions.at(0).reset();
    } else {
      this.questions.removeAt(index);
    }
  }

  getAnswers(questionIndex: number){
    return this.questions.at(questionIndex).get('answers') as FormArray;
  }

  addAnswer(questionIndex: number){
    const answers = this.getAnswers(questionIndex);
    if (answers.length <6){
      answers.push(this.createAnswer());
    }
  }

  removeAnswer(questionIndex: number, answerIndex: number){
    if (questionIndex === 0 && answerIndex < 2) {
      this.getAnswers(0).at(answerIndex).reset();
    } else {
      this.getAnswers(questionIndex).removeAt(answerIndex);
    }
  }

  getLetter(index: number) {
  return String.fromCharCode(65 + index);
}
}
