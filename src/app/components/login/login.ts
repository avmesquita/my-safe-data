import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { MatFormField, MatLabel } from "@angular/material/input";
import { MatIconModule } from "@angular/material/icon";
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { DatasetService } from '../../services/dataset';
import { UserDto } from '../../models/user.dto';

@Component({
  selector: 'app-login',
  imports: [FormsModule, MatFormField, MatLabel, MatIconModule, MatCardModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  @Output('onAuthenticate') onAuthenticate: EventEmitter<boolean> = new EventEmitter(false);

  @ViewChild('inputUsername') inputUsername!: ElementRef;
  @ViewChild('inputPassword') inputPassword!: ElementRef;

  newUsername: string = '';
  newPassword: string = '';

  constructor(private service: DatasetService) {}

  isFormValid(): boolean {
    return (
      this.newUsername.length > 0 &&
      this.newPassword.length >= 4
    );
  }  

  login() {
    if (this.isFormValid()) {
     this.service.getUser().then(
      (data: any) => {
        this.service.setStatusMessage('veio data');
        if (data) {
          this.service.setStatusMessage('data tá cheio');
          if (data.length > 0) {
            this.service.setStatusMessage('tem coisa no array');
            
            this.onAuthenticate.emit(true);
          }
        }
        
        /*
        if (data.name == this.newUsername && data.newPassword == this.newPassword) {
          this.onAuthenticate.emit(true);
        } else {
          this.onAuthenticate.emit(false);
        }
        */
      }
     )   
    }
  }

  hidePassword(hide: boolean) {
    return !hide;
  }

}
