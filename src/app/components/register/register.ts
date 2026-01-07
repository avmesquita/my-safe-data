import { Component, ElementRef, ViewChild } from '@angular/core';
import { MatFormField, MatLabel, MatInputModule } from "@angular/material/input";
import { MatIconModule } from "@angular/material/icon";
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { DatasetService } from '../../services/dataset';
import { UserDto } from '../../models/user.dto';

@Component({
  selector: 'app-register',
  imports: [FormsModule, MatFormField, MatLabel, MatIconModule, MatCardModule, MatInputModule],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register {
  @ViewChild('inputUsername') inputUsername!: ElementRef;
  @ViewChild('inputPassword') inputPassword!: ElementRef;

  newUsername: string = '';
  newPassword: string = '';
  newConfirmPassword: string = '';
  hidePassword: boolean = true;
  passwordStrength: string = '';

  constructor(private service: DatasetService) {}

  checkPasswordStrength() {    
    if (this.newPassword.length < 4) this.passwordStrength = 'Too short';
    else if (this.newPassword.length < 8) this.passwordStrength = 'Medium';
    else this.passwordStrength = 'Strong ✅';
  }

  isFormValid(): boolean {
    return (
      this.newUsername.length > 0 &&
      this.newPassword.length >= 4 &&
      this.newConfirmPassword === this.newPassword
    );
  }  

  async register() {
    if (this.isFormValid()) {
      try {
        const dto = new UserDto();
        dto.name = this.newUsername;
        dto.data = this.newPassword;
        return await this.service.addUser(dto);
      } catch (error) {
        
      }
    }
  }

}
