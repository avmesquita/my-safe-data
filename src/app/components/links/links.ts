import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { DatasetService } from '../../services/dataset';
import { LinkDto } from '../../models/link.dto';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-links',
  imports: [
    MatTableModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,               
    FormsModule,
    DatePipe
  ],
  templateUrl: './links.html',
  styleUrl: './links.scss',
})
export class Links {
  @ViewChild('inputName') inputName!: ElementRef;
  @ViewChild('inputData') inputData!: ElementRef;
    
  newName: string = '';
  newData: string = '';

  gridColumns: string[] = ['id', 'name', 'instant', 'data', 'actions'];

  links: LinkDto[] = [];

  constructor(private readonly service: DatasetService) {}

  async ngOnInit() {
    await this.loadLinks();
  }

  async ngAfterViewInit() {
    //await this.loadLinks();    
  }

  async loadLinks() {
    this.service.listLinks().then(
      (data: any[]) => {                
        this.service.setStatusMessage(data?.length?.toString() + ' bookmarks found.');
        this.links = data;
      }
    );    
  }
  async add() {
    var name = this.inputName.nativeElement.value;
    var data = this.inputData.nativeElement.value;

    const dto = new LinkDto();
    dto.name = name;
    dto.data = data;

    this.service.addLink(dto).then(
      (data: any) => {
        this.loadLinks();
        return data;
      }
    )
  }

  async delete(id: number) {
    if (confirm('Are you sure')) {
      await this.service.deleteLink(id).then(
        (data: any) => {
          this.loadLinks();
          return data;
        }
      );
    }
  }
}
