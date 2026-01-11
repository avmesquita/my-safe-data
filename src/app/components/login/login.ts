import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { MatFormField, MatInputModule, MatLabel } from "@angular/material/input";
import { MatIconModule } from "@angular/material/icon";
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { DatasetService } from '../../services/dataset';
import { MatButtonModule } from '@angular/material/button';
import { AuthDto } from '../../models/auth.dto';

@Component({
  selector: 'app-login',
  imports: [FormsModule, MatFormField, MatLabel, MatIconModule, MatCardModule, MatInputModule, MatButtonModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  @Output('onAuthenticate') onAuthenticate: EventEmitter<boolean> = new EventEmitter(false);

  @ViewChild('inputUsername') inputUsername!: ElementRef;
  @ViewChild('inputPassword') inputPassword!: ElementRef;

  newUsername: string = '';
  newPassword: string = '';
  hidePassword: boolean = true;

  constructor(private service: DatasetService) {}

  isFormValid(): boolean {
    return (
      this.newUsername.length > 0 &&
      this.newPassword.length >= 4
    );
  }  

  async login() {
    if (!this.isFormValid()) {
        this.service.setStatusMessage('Please fill all fields.');
        return;
    }      
    const dto = new AuthDto(this.newUsername, this.newPassword);
    const data = await this.service.authenticate(dto);
    debugger;
    if (data && data.id > 0 && data.name.length > 0 && data.instant) {
      this.service.setStatusMessage('Login Successful!');
      this.onAuthenticate.emit(true);
    } else {
      this.service.setStatusMessage('Invalid Credentials.');
    }
  }
}
