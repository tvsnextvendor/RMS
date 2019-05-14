import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
  })

export class FileService {

  fileList=[];

  constructor() { }


  saveFileList(opr,file){
    if(opr == 'add'){
      this.fileList.push(file);
    }else{
      let index = this.fileList.findIndex(x => x.fileId === file.fileId);
      this.fileList.splice(index,1);
    }
  }

  getSelectedList(type){
   let fileList = this.fileList.filter(ele => {
        return ele.fileType == type;
    }) 
    return fileList;
  }

  selectedFiles(){
    return this.fileList;
  }

}