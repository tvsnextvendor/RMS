import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class QuizVar {
    quizLabels = {
        course       : 'Course ',
        video        : 'Video',
        assignTo     : 'Assign To',
        questionType : 'Question Type',
        question     : 'Question',
        options      : 'Options',
        true         : 'True',
        false        : 'False',
        weightage    : 'Weightage',
        totalNoOfQuestions:'Total No of Question(s)'
       
    };
    btns = {
        saveBtn : 'SAVE',
        cancel : 'Cancel',
        addQuiz      : 'Add Quiz'
     };
     mandatoryLabels ={
         courseName  : 'Course name is required',
         videoName   : 'Video name is required',
         isRequired  : 'is required',       
     };
    
}