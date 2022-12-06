import { UyeModel } from './../../models/uyeModel';
import { MytoastService } from './../../services/mytoast.service';
import { DatabaseService } from 'src/app/services/data.service';
import { Component, OnInit } from '@angular/core';
import { Sonuc } from 'src/app/models/sonucModel';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  constructor(
    public dataServis: DatabaseService,
    public toast: MytoastService
  ) {}

  ngOnInit() {}

  OturumAc(mail: string, parola: string) {
    this.dataServis.OturumAc(mail, parola).subscribe((d) => {
      console.log(mail, parola);
      if (d.length > 0) {
        var kayit: UyeModel = d[0];
        localStorage.setItem('kadi', kayit.kullaniciKadi);
        localStorage.setItem('adminMi', kayit.kullaniciAdminMi.toString());
        localStorage.setItem('id', kayit.id.toString());
        location.href = '/';
      } else {
        var s: Sonuc = new Sonuc();
        s.islem = false;
        s.mesaj = 'E-Posta Adresi veya Parola Geçersizdir!';
        this.toast.ToastUygula(s);
      }
    });
  }
}
