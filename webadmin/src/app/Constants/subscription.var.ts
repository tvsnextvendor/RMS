import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })

export class SubscriptionVar {

    labels = {
      name : 'Subscription Name',
      storageSpace : 'Total Storage Space',
      allocatedSpace : 'Allocated Space',
      availableSpace : 'Available Space',
      course : 'Max no of Courses',
      license : 'No of Licenses',
      tenure : 'Tenure',
      year : 'Years',
      month : 'Months'
    };
    
    mandatoryText = {
      name : 'Subscription Name is required',
      storageSpace : 'Total Storage Space is required',
      course : 'Max no of Courses is required',
      license : 'No of Licenses is required',
      tenureYear : 'Year is required',
      tenureMonth : 'Month is required'
    };

    title : 'Subscription Model';
}