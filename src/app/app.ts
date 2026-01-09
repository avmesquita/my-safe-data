import { Component, ElementRef, NgZone, OnInit, Output, signal, ViewChild } from '@angular/core';

import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabChangeEvent, MatTabsModule } from '@angular/material/tabs';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Contacts } from "./components/contacts/contacts";
import { DatasetService } from './services/dataset';
import { Links } from "./components/links/links";
import { Notes } from "./components/notes/notes";
import { Passwords } from "./components/passwords/passwords";
import { Dashboard } from "./components/dashboard/dashboard";
import { Login } from "./components/login/login";
import { Register } from "./components/register/register";

@Component({
  selector: 'app-root',
  imports: [
    MatTableModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
    FormsModule,
    ReactiveFormsModule,
    Contacts,
    Links,
    Notes,
    Passwords,
    Dashboard,
    Login,
    Register
],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  userExists: boolean = false;
  userConnected: boolean = false;

  constructor(private zone: NgZone, private service: DatasetService) {}

  async ngOnInit() {

    this.service.getUser().then(
      (data: any) => {
        if (data) {
          this.userExists = data.length > 0;
        } else {
          this.userExists = false;
        }
      }
    );

    (window as any).dbAPI.onStatusUpdate((mensagem: string) => {      
      this.zone.run(() => {
        this.service.setStatusMessage(mensagem);
        setTimeout(() => this.service.getStatusMessage(), 10000);
      });
    });    

    (window as any).dbAPI.onDatabaseStatusUpdate((status: boolean) => {      
      this.zone.run(() => {
        this.service.isDbConnected = status;        
      });
    });

  }

  getStatusMessage() {
    return this.service.getStatusMessage();
  }

  getDatabaseStatus() {
    return this.service.isDbConnected;
  }

  async onTabChanged(event: MatTabChangeEvent) {
    //console.log('Tab Index:' + event.index +  '|' + 'Tab Title:' + event.tab.textLabel);
  }  

  async onTabIndexChange(event: any) {
    //console.log('Event:' + event);
  }

  onAuthenticate(value: boolean) {
    this.userConnected = value;
  }

  onRegister(value: boolean) {
    this.userExists = value;
  }


}
