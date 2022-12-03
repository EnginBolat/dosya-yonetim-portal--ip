import { DatabaseService } from './services/data.service';
import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Dosya Yönetim Portalı';
  constructor(
    public servis: DatabaseService
  ) { }
  ngOnInit(): void {
  }
  OturumKapat() {
    localStorage.clear();
    location.href = "";
  }
}
