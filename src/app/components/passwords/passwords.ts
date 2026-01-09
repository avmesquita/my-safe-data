import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { DatasetService } from '../../services/dataset';
import { PasswordDto } from '../../models/password.dto';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-passwords',
  imports: [
    MatTableModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,               
    FormsModule,
    DatePipe
  ],
  templateUrl: './passwords.html',
  styleUrl: './passwords.scss',
})
export class Passwords {
  @ViewChild('inputName') inputName!: ElementRef;
  @ViewChild('inputData') inputData!: ElementRef;
    
  newName: string = '';
  newData: string = '';

  gridColumns: string[] = ['id', 'name', 'instant', 'data', 'actions'];

  passwords: PasswordDto[] = [];

  constructor(private readonly service: DatasetService) {}

  async ngAfterViewInit() {
    await this.loadPasswords();
  }

  async loadPasswords() {
    this.service.listPasswords().then(
      (data: any) => {
        this.passwords = data;
      }
    );
  }

  async add() {
    var name = this.inputName.nativeElement.value;
    var data = this.inputData.nativeElement.value;

    const dto = new PasswordDto();
    dto.name = name;
    dto.data = data;

    this.service.addPassword(dto).then(
      (data: any) => {
        this.loadPasswords();
        return data;
      }
    )
  }

  async delete(id: number) {
    if (confirm('Are you sure?')) {
      await this.service.deletePassword(id).then(
        (data: any) => {
          this.loadPasswords();
          return data;
        }
      );
    }
  }
}
