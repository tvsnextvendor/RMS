import { Injectable } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { UtilService  } from './util.service';
import { Permissions } from '../Constants/role_permission' ;

@Injectable({
    providedIn: 'root'
})

export class PermissionService implements OnInit {

    rolePermission;
    constructor(private utilservice : UtilService) {}

    ngOnInit() {}

    viewPermissionCheck(modules){
        let role = this.utilservice.getRole();
        this.rolePermission = this.utilservice.getRolePermissions().length ? this.utilservice.getRolePermissions() : Permissions.user.menu;
        if(role != 4){
            this.rolePermission = Permissions.peeradmin.menu;
        }
        let permissionEnable = false;
        this.rolePermission.forEach(item=>{
            if(item.moduleName == modules){
                permissionEnable = item.view
            }
        })
        return permissionEnable;
    }

    editPermissionCheck(modules){
        let role = this.utilservice.getRole();
        this.rolePermission = this.utilservice.getRolePermissions().length ? this.utilservice.getRolePermissions() : Permissions.user.menu;
        if(role != 4){
            this.rolePermission = Permissions.peeradmin.menu;
        }
        let permissionEnable = false;
        this.rolePermission.forEach(item=>{
            if(item.moduleName == modules){
               permissionEnable = item.edit
            }
        })
        return permissionEnable;
    }

    uploadPermissionCheck(modules){
        let role = this.utilservice.getRole();
        this.rolePermission = this.utilservice.getRolePermissions().length ? this.utilservice.getRolePermissions() : Permissions.user.menu;
        if(role != 4){
            this.rolePermission = Permissions.peeradmin.menu;
        }
        let permissionEnable = false;
        this.rolePermission.forEach(item=>{
          if(item.moduleName == modules){
            permissionEnable = item.upload
          }
        })
        return permissionEnable;
    }

}