import { Component, ElementRef, viewChild } from '@angular/core';

@Component({
  selector: 'app-new-survey',
  imports: [],
  templateUrl: './new-survey.html',
  styleUrl: './new-survey.scss',
})
export class NewSurvey {
  dialogRef = viewChild<ElementRef<HTMLDialogElement>>('newSurveyDialog');

  open() {
    this.dialogRef()?.nativeElement.showModal();
  }

  close(){
    this.dialogRef()?.nativeElement.close();
  }
}
