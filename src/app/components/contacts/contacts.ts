import { AfterViewInit, Component, ElementRef, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { DatasetService } from '../../services/dataset';
import { ContactDto } from '../../models/contact.dto';
import { AsyncPipe, DatePipe } from '@angular/common';

@Component({
  selector: 'app-contacts',
  imports: [
    MatTableModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,               
    FormsModule,
    ReactiveFormsModule,
    DatePipe    
  ],
  templateUrl: './contacts.html',
  styleUrl: './contacts.scss',
})
export class Contacts implements AfterViewInit, OnInit {
  contacts: ContactDto[] = [];

  @ViewChild('inputName') inputName!: ElementRef;
  @ViewChild('inputData') inputData!: ElementRef;
    
  newName: string = '';
  newData: string = '';

  gridColumns: string[] = ['id', 'name', 'instant', 'data', 'actions'];

  contactForm: FormGroup;

  constructor(private readonly service: DatasetService) {

    this.contactForm = new FormGroup(
      { 
        name: new FormControl(''), 
        data: new FormControl('') 
      }
    );
  }

  async ngOnInit() {
    await this.loadContacts();
  }

  async ngAfterViewInit() {
    //await this.loadContacts();    
  }

  async loadContacts() {
    this.service.listContacts().then(
      (data: any[]) => {                
        this.service.setStatusMessage(data?.length?.toString() + ' contacts found.');
        this.contacts = data;
      }
    );    
  }

  async add() {    
    var name = this.inputName.nativeElement.value;
    var data = this.inputData.nativeElement.value;

    //for new version
    //name = this.contactForm?.controls["name"].value;
    //data = this.contactForm?.controls["data"].value;

    const dto = new ContactDto();
    dto.name = name;
    dto.data = data;

    this.service.addContact(dto).then(
      (data: any) => {
        this.loadContacts();
        return data;        
      }
    )
  }

  async delete(id: number) {
    if (confirm('Are you sure?')) {
      await this.service.deleteContact(id).then(
        (data: any) => {
          this.loadContacts();
          return data;
        }
      );
    }
  }

}
