import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { DatasetService } from '../../services/dataset';
import { NoteDto } from '../../models/note.dto';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-notes',
  imports: [
    MatTableModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,               
    FormsModule,
    DatePipe
  ],
  templateUrl: './notes.html',
  styleUrl: './notes.scss',
})
export class Notes {
  @ViewChild('inputName') inputName!: ElementRef;
  @ViewChild('inputData') inputData!: ElementRef;
    
  newName: string = '';
  newData: string = '';

  gridColumns: string[] = ['id', 'name', 'instant', 'data', 'actions'];

  notes: NoteDto[] = [];

  constructor(private readonly service: DatasetService) {}

  async ngAfterViewInit() {
    await this.loadNotes();
  }

  async loadNotes() {
    this.service.listNotes().then(
      (data: any) => {
        this.notes = data;
      }
    );
  }

  async add() {
    var name = this.inputName.nativeElement.value;
    var data = this.inputData.nativeElement.value;

    const dto = new NoteDto();
    dto.name = name;
    dto.data = data;

    this.service.addNote(dto).then(
      (data: any) => {
        this.loadNotes();
        return data;
      }
    )
  }

  async delete(id: number) {
    if (confirm('Are you sure?')) {
      await this.service.deleteNote(id).then(
        (data: any) => {
          this.loadNotes();
          return data;
        }
      );
    }
  }
}
