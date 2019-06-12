import {Injectable} from '@angular/core'
import { BehaviorSubject } from 'rxjs/BehaviorSubject'

@Injectable()

export class QuizService {
  
  getQuiz = new BehaviorSubject(null)
  selectedQuiz = this.getQuiz.asObservable();

  constructor() { }
  
  setQuiz(questions) {
      this.getQuiz.next(questions);
   }
  
  
}