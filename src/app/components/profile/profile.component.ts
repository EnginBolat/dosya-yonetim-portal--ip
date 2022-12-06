import { DosyaModel } from './../../models/dosyaModel';
import { UyeModel } from './../../models/uyeModel';
import { Component, OnInit } from '@angular/core';
import { DatabaseService } from 'src/app/services/data.service';
import { Input } from '@angular/core';
import { Sonuc } from 'src/app/models/sonucModel';
import { MytoastService } from 'src/app/services/mytoast.service';
import { ActivatedRoute } from '@angular/router';
import { ThisReceiver } from '@angular/compiler';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  uye!: UyeModel;
  dosyalar!: DosyaModel[];
  sonuc: Sonuc = new Sonuc();
  localId: number = 3;
  constructor(
    public servis: DatabaseService,
    public toast: MytoastService,
    public route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.params.subscribe((p: any) => {
      this.localId = p.profileId;
    });
    this.UyeBilgiAl(this.localId);
    this.DosyaAl(this.localId);
  }

  UyeBilgiAl(id: number) {
    this.servis.UyeById(id).subscribe((p) => {
      this.uye = p;
    });
  }

  DosyaAl(id: number) {
    this.servis.DosyaByUyeId(id).subscribe((d) => {
      this.dosyalar = d;
    });
  }
  DosyaIndir() {
    this.sonuc.islem = true;
    this.sonuc.mesaj = 'Dosya İndiriliyor';
    this.toast.ToastUygula(this.sonuc);
  }
}
