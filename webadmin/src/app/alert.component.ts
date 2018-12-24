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
    moduleId: module.id,
    selector: 'alert',
    template: `<div *ngFor="let alert of alerts" class="{{ cssClass(alert) }} alert-dismissable"><i class="fa fa-times cp" (click)="removeAlert(alert)"></i> {{alert.message}}</div>`
})
 
export class AlertComponent implements OnInit {
    alerts: Alert[] = [];
    constructor(private alertService: AlertService) { }
 
    ngOnInit() {
        this.alertService.getAlert().subscribe((alert: Alert) => {
            if (!alert) {
                // clear alerts when an empty alert is received
                this.alerts = [];
                return;
            }
 
            // add alert to array
            this.alerts.push(alert);
        });
    }
 
    removeAlert(alert: Alert) {
        this.alerts = this.alerts.filter(x => x !== alert);
    }
 
    cssClass(alert: Alert) {
        if (!alert) {
            return;
        }
 
        // return css class based on alert type
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
    
