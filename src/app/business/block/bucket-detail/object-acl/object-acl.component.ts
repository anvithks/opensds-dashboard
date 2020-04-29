import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit, ViewContainerRef, ViewChild, Directive, ElementRef, HostBinding, HostListener, Input } from '@angular/core';
import { I18NService, MsgBoxService, HttpService, Utils } from 'app/shared/api';
import { BucketService } from '../../buckets.service';
import { ConfirmationService, ConfirmDialogModule } from '../../../../components/common/api';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { I18nPluralPipe } from '@angular/common';
import { FormGroup, Validators, FormBuilder, FormControl } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Http, Headers } from '@angular/http';

declare let X2JS: any;
let _ = require("underscore");
let lodash = require('lodash');
let CryptoJS = require("crypto-js");
@Component({
    selector: 'objectAcl',
    templateUrl: './object-acl.component.html',
    styleUrls: [],
    providers: [ConfirmationService, MsgBoxService]
})
export class ObjectAclComponent implements OnInit {
    cols: any=[{a:1}];
    checkBoxArr: string[]
    Signature;
    kDate;
    key;
    bucketId;
    items = [];
    folderId = "";
    backetUrl;
    constructor(
        private BucketService: BucketService,
        private ActivatedRoute: ActivatedRoute,
    ) {}
    ngOnInit() {
        this.ActivatedRoute.params.subscribe((params)=>{
            this.key = params.key
            this.bucketId = params.bucketId
            
        })
        this.getObjectAclList()
    }

    // query Objectacl list
    getObjectAclList() {
        this.items = window.sessionStorage['headerTag'] && window.sessionStorage['headerTag'] != "" ? JSON.parse(window.sessionStorage.getItem("headerTag")) : [];
        window['getAkSkList'](()=> {
                let requestMethod = "GET";
                let url = '/' + this.bucketId+ '/' + this.key + '/' + '?acl';
                let requestOptions: any;
                let options: any = {};
                requestOptions = window['getSignatureKey'](requestMethod, url) ;
                options['headers'] = new Headers();
                options = this.BucketService.getSignatureOptions(requestOptions, options);
                this.BucketService.getObjectAcl(this.bucketId + '/' + this.key,options).subscribe((res) => {
                    let str = res['_body'];
                    let x2js = new X2JS();
                    let jsonObj = x2js.xml_str2json(str);
                    let chooseObj = jsonObj.AccessControlPolicy.AccessControlList.Grant
                    this.checkBoxArr = []
                    if(chooseObj){
                        if(chooseObj.Permission =="FULL_CONTROL"){
                            this.checkBoxArr.push('write','read');
                        }else if(chooseObj.Permission == "READ"){
                            this.checkBoxArr.push('read');
                        }
                    }
                    
                })
        })
    }
    
    // creat Objectacl 
    onSubmit() {
        let user 
        let isWrite =  this.checkBoxArr.some((item)=>{return item=='write'}) 
        let isRead = this.checkBoxArr.some((item)=>{return item=='read'})
        if(isWrite) {
            user = 'public-read-write'
        }else if(isRead){
            user = 'public-read'
        }else {
            user = 'private'
        }
        let data = {}
        this.creatObjectAclSubmit(data,user)

    }
    creatObjectAclSubmit(param,user) {
        window['getAkSkList'](()=> {
                let requestMethod = "PUT";
                let url = '/' + this.bucketId+ '/' + this.key + '/' + '?acl';
                let requestOptions: any;
                let options: any = {};
                requestOptions = window['getSignatureKey'](requestMethod, url) ;
                options['headers'] = new Headers();
                options = this.BucketService.getSignatureOptions(requestOptions, options);
                options.headers.set('Content-Length', param.length);
                options.headers.set('x-amz-acl', user);
                this.BucketService.creatObjectAcl(this.bucketId + '/' + this.key, param, options).subscribe((res)=> {
                    this.getObjectAclList()
                }, (error) => {
                    console.log("Could not create Object ACL. Something went wrong.", error);
                })
        })
    }

   
    //Click on folder navigation
  navigateClick(itemUrl){
    this.items.forEach((item,index)=>{
      if(item.url[0] == itemUrl[0]){
        this.items = this.items.slice(0, index+1);
      }
    })
    let newLength = this.items.length-1;
    this.backetUrl = this.items[newLength].url[0].slice(1);
    if(itemUrl[0].slice(1) == this.bucketId){
      this.folderId = "";
    }else{
      this.folderId = this.backetUrl;
    }
    window.sessionStorage['headerTag'] = JSON.stringify(this.items)
    window.sessionStorage['folderId'] = JSON.stringify(this.folderId);
  }
}
