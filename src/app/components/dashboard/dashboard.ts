import { AfterViewInit, Component, OnInit } from '@angular/core';
import { DatasetService } from '../../services/dataset';
import { DashboardDto } from '../../models/dashboard.dto';

@Component({
  selector: 'app-dashboard',
  imports: [

  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit, AfterViewInit {

  totals: DashboardDto;

  constructor(private readonly service: DatasetService) {
    this.totals = new DashboardDto();
  }

  ngOnInit(): void {    
    this.loadData();
  }

  ngAfterViewInit() {
    this.loadData();
  }

  async loadData() {
    this.service.listContacts().then(
      (data: any) => this.totals.contacts = data.length
    );
    this.service.listLinks().then(
      (data: any) => this.totals.links = data.length
    );
    this.service.listNotes().then(
      (data: any) => this.totals.notes = data.length
    );
    this.service.listPasswords().then(
      (data: any) => this.totals.passwords = data.length
    );   
  }

}
