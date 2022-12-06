import { DosyaModel } from './../../models/dosyaModel';
import { UyeModel } from './../../models/uyeModel';
import { Component, OnInit } from '@angular/core';
import { DatabaseService } from 'src/app/services/data.service';
import { Modal } from 'bootstrap';
import * as bootstrap from 'bootstrap';
import { Sonuc } from 'src/app/models/sonucModel';
import { MytoastService } from 'src/app/services/mytoast.service';
import { ActivatedRoute } from '@angular/router';
import { ThisReceiver } from '@angular/compiler';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  uye!: UyeModel;
  dosyalar!: DosyaModel[];
  sonuc: Sonuc = new Sonuc();
  modal!: Modal;
  secDosya!: DosyaModel;
  localStatus!: number;
  modalBaslik: string = '';
  localId: number = 3;
  frm: FormGroup = new FormGroup({
    id: new FormControl(),
    dosyaAdi: new FormControl(),
    photo: new FormControl(),
    dosyaBoyut: new FormControl(),
    dosyaBoyutTuru: new FormControl(),
    usersId: new FormControl(),
    dosyaAdminOzelMi: new FormControl(),
    dosyaYuklenmeTarihi: new FormControl(),
    dosyaDuzenlenmeTarihi: new FormControl(),
    dosyaYukleyenKadi: new FormControl(),
  });
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

  Ekle(el: HTMLElement) {
    this.frm.reset();
    this.modal = new bootstrap.Modal(el);
    this.modalBaslik = 'Dosya Ekle';
    this.modal.show();
  }
  Duzenle(dosya: DosyaModel, el: HTMLElement) {
    this.frm.patchValue(dosya);
    this.modalBaslik = 'Dosya Düzenle';
    this.modal = new bootstrap.Modal(el);
    this.modal.show();
  }
  Sil(dosya: DosyaModel, el: HTMLElement) {
    this.secDosya = dosya;
    this.modalBaslik = 'Dosya Sil';
    this.modal = new bootstrap.Modal(el);
    this.modal.show();
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
    for (let index = 0; index < this.dosyalar.length; index++) {
      this.localStatus = this.dosyalar[index].userId
      
    }
  }
  DosyaIndir() {
    this.sonuc.islem = true;
    this.sonuc.mesaj = 'Dosya İndiriliyor';
    this.toast.ToastUygula(this.sonuc);
  }

  DosyaEkleDuzenle() {
    var dosya: DosyaModel = this.frm.value;
    var tarih = new Date();
    if (!dosya.id) {
      var filtre = this.dosyalar.filter((s) => s.dosyaAdi == dosya.dosyaAdi);
      if (filtre.length > 0) {
        this.sonuc.islem = false;
        this.sonuc.mesaj = 'Girilen Dosya Kayıtlıdır!';
        this.toast.ToastUygula(this.sonuc);
      } else {
        dosya.dosyaYukleyenKadi = this.servis.aktifUye.kullaniciKadi;
        dosya.userId = this.servis.aktifUye.id;
        dosya.dosyaYuklenmeTarihi = tarih.getTime().toString();
        dosya.dosyaDuzenlenmeTarihi = tarih.getTime().toString();
        this.servis.DosyaEkle(dosya).subscribe((d) => {
          this.sonuc.islem = true;
          this.sonuc.mesaj = 'Dosya Eklendi';
          this.toast.ToastUygula(this.sonuc);
          this.DosyaAl(this.localId);
          this.modal.toggle();
        });
      }
    } else {
      dosya.dosyaDuzenlenmeTarihi = tarih.getTime().toString();
      this.servis.DosyaDuzenle(dosya).subscribe((d) => {
        this.sonuc.islem = true;
        this.sonuc.mesaj = 'Dosya Düzenlendi';
        this.toast.ToastUygula(this.sonuc);
        this.DosyaAl(this.localId);
        this.modal.toggle();
      });
    }
  }
  DosyaSil() {
    this.servis.DosyaSil(this.secDosya.id).subscribe((l) => {
      this.sonuc.islem = true;
      this.sonuc.mesaj = 'Dosya Silindi';
      this.toast.ToastUygula(this.sonuc);
      this.DosyaAl(this.localId);
      this.modal.toggle();
    });
  }
}
