import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})

export class FileService {

    fileList = [];
    localFileList =[];

    constructor() { }

    sendFileList(opr, file) {
        if (opr == 'add') {
            this.localFileList.push(file);
        } else {
            let index = this.fileList.findIndex(x => x.fileId === file.fileId);
            this.localFileList.splice(index, 1);
        }
    }

    saveFileList(){
      this.fileList = this.localFileList;
    }

    getSelectedList(type) {
        let fileList = this.fileList.length && this.fileList.filter(ele => {
            return ele.fileType == type;
        })
        return fileList;
    }

    selectedFiles() {
        return this.fileList;
    }

    emptyFileList() {
        this.fileList = [];
        return this.fileList;
    }

    emptyLocalFileList(){
      this.localFileList=[];
    }

}