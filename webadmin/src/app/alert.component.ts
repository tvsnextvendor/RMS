import { Component, OnInit } from '@angular/core';
export class Alert {
    type: AlertType;
    message: string;
}
export enum AlertType {
    Success,
    Error,
    Info,
    Warning
}
import { AlertService } from './services/alert.service';
@Component({
    selector: 'alert',
    template: `<div *ngIf="hideTopMessage"><div *ngFor="let alert of alerts" id="alert-box" class="{{ cssClass(alert) }}  fade show alert-dismissable">
    <a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>
   {{alert.message}}</div></div>`
})
 
export class AlertComponent implements OnInit {
    alerts: Alert[] = [];
    hideTopMessage:boolean = true;
    constructor(private alertService: AlertService) { }
    ngOnInit() {
        this.alertService.getAlert().subscribe((alert: Alert) => {
            if (!alert) {
                this.alerts = [];
                return;
            }
            this.hideTopMessage = true;
            this.alerts.push(alert);
            this.fadeOut();
        });
    }
    
    removeAlert(alert: Alert) {
        this.alerts = this.alerts.filter(x => x !== alert);
    }
    cssClass(alert: Alert) {
        if (!alert) {
            return;
        }
        switch (alert.type) {
            case AlertType.Success:
                return 'alert alert-success';
            case AlertType.Error:
                return 'alert alert-danger';
            case AlertType.Info:
                return 'alert alert-info';
            case AlertType.Warning:
                return 'alert alert-warning';
        }
    }
    fadeOut(){
        setTimeout(() => {
                this.hideTopMessage = false;
                this.alerts = [];
            }, 2000); 
    }
    
}