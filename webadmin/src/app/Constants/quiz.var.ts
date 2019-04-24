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
        answer       : 'Answer',
        true         : 'True',
        false        : 'False',
        weightage    : 'Weightage',
        totalNoOfQuestions:'Total No of Question(s)',
        "deleteQuiz": "Delete Quiz",
        "deleteConfirmation": "Are you sure you want to delete this quiz question?",
       
    };
    btns = {
        saveBtn : 'SAVE',
        cancel : 'Cancel',
        addQuiz  : 'Add Quiz',
        ok : 'Ok'
     };
     mandatoryLabels ={
         courseName  : 'Course name is required',
         videoName   : 'Video name is required',
         isRequired  : 'is required',       
     };
    
}