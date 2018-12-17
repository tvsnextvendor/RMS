import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ModuleVar {
   
    active       = 'Active';
    title        = 'Modules';
    createModule = 'Create Module';
    activeStatus =  [];
    moduleList;
    url;
    moduleId;
    courseId;
    videoLink;
    selectedModule;
    selectedCourse;
    
  
    
}