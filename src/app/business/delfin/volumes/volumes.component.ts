import { Component, OnInit, Input, ViewContainerRef, ViewChild, Directive, ElementRef, HostBinding, HostListener } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { I18NService, Utils } from 'app/shared/api';
import { FormControl, FormGroup, FormBuilder, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { AppService } from 'app/app.service';
import { I18nPluralPipe } from '@angular/common';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Message, MenuItem ,ConfirmationService, LazyLoadEvent} from '../../../components/common/api';
import { DelfinService } from '../delfin.service';
import { OverlayPanel } from 'app/components/overlaypanel/overlaypanel';


let _ = require("underscore");
@Component({
    selector: 'app-delfin-volumes',
    templateUrl: 'volumes.component.html',
    providers: [ConfirmationService],
    styleUrls: [],
    animations: []
})
export class StorageVolumesComponent implements OnInit {
    @Input() selectedStorage;
    volumesArr = [];
    allVolumes: any = [];
    allStorages: any = [];
    selectedStorageId: any;
    items: any;
    capacityData: any;
    dataSource: any = [];
    totalRecords: number;
    volumeOverview: any;
    label = {
        name: this.i18n.keyID["sds_block_volume_name"],
        description: this.i18n.keyID["sds_block_volume_descri"],
        vendor: "Vendor",
        model: "Model",
        status: "Status",
        host: "Host IP",
        port: "Port",
        username: "Username",
        password: "Password",
        extra_attributes: "Extra Attributes",
        created_at: "Created At",
        updated_at: "Updated At",
        firmware_version: "Firmware Version",
        serial_number : "Serial Number",
        location : "Location",
    };

    constructor(
        private ActivatedRoute: ActivatedRoute,
        public i18n: I18NService,
        private confirmationService: ConfirmationService,
        private fb: FormBuilder,
        private ds: DelfinService
    ) {
        
    }

    ngOnInit() {
        this.ds.getAllVolumes().subscribe((res)=>{
            this.allVolumes = res.json().volumes;
            console.log("All Volumes", this.allVolumes, this.selectedStorage);
            this.allVolumes.forEach(element => {
                if(element['storage_id'] == this.selectedStorage.id){
                    this.dataSource.push(element);
                }
            });
            this.totalRecords = this.dataSource.length;
            this.volumesArr = this.dataSource.slice(0, 10);
            console.log("Selected Volumes", this.volumesArr);
        }, (error)=>{
            console.log("Something went wrong. Could not fetch Volumes.", error)
        });
        this.ActivatedRoute.params.subscribe((params) => {
            this.selectedStorageId = params.storageId;
        });
        this.getAllStorages();
       
        //this.getStorageById(this.selectedStorageId);
        
        console.log("Volumes Array", this.allVolumes, this.volumesArr);
    }

    loadVolumesLazy(event: LazyLoadEvent){
        if(this.dataSource){
            this.volumesArr = this.dataSource.slice(event.first, (event.first + event.rows));
        }
    }
    
    getAllStorages(){
        this.ds.getAllStorages().subscribe((res)=>{
            console.log("All Storages", res.json().storages);
            this.allStorages = res.json().storages;
        }, (error)=>{
            console.log("Something went wrong. Could not fetch all storages", error);
        })
    }

    getStorageById(id){
        this.ds.getStorageById(id).subscribe((res)=>{
            console.log("Selected Storage", res.json());
            this.selectedStorage = res.json();
            this.capacityData = {
                labels: ['Used','Free'],
                datasets: [
                    {
                        data: [this.selectedStorage['used_capacity'], this.selectedStorage['free_capacity']],
                        backgroundColor: [
                            "#FF6384",
                            "#45e800"
                        ],
                        hoverBackgroundColor: [
                            "#FF6384",
                            "#45e800"
                        ]
                    }]    
            };
        }, (error)=>{
            console.log("Something went wrong. Could not fetch storage", error);
        })
    }

    getAllVolumes(){
        this.ds.getAllVolumes().subscribe((res)=>{
            this.allVolumes = res.json().volumes;
            console.log("All Volumes", this.allVolumes, this.selectedStorage);
            this.allVolumes.forEach(element => {
                if(element['storage_id'] == this.selectedStorage.id){
                    this.volumesArr.push(element);
                }
            });
            console.log("Selected Volumes", this.volumesArr);
        }, (error)=>{
            console.log("Something went wrong. Could not fetch Volumes.", error)
        });
    }

    showVolumeOverview(event, volume, overlaypanel: OverlayPanel){
        this.volumeOverview = volume;
        console.log("Overlayshown", this.volumeOverview);
        overlaypanel.toggle(event);
    }
    fetchVolume(){
        console.log("Volume Fetched", this.volumeOverview);
    }
}