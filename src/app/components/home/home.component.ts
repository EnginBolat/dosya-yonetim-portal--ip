import { UyeModel } from './../../models/uyeModel';
import { DosyaModel } from './../../models/dosyaModel';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Modal } from 'bootstrap';
import * as bootstrap from 'bootstrap';
import { Sonuc } from 'src/app/models/sonucModel';
import { DatabaseService } from 'src/app/services/data.service';
import { MytoastService } from 'src/app/services/mytoast.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  dosyalar!: DosyaModel[];
  uyeler!: UyeModel[];
  modal!: Modal;
  modalBaslik: string = '';
  secDosya!: DosyaModel;
  sonuc: Sonuc = new Sonuc();
  frm: FormGroup = new FormGroup({
    id: new FormControl(),
    dosyaAdi: new FormControl(),
    dosyaBoyut: new FormControl(),
    dosyaBoyutTuru: new FormControl(),
    usersId: new FormControl(),
    dosyaAdminOzelMi: new FormControl(),
    dosyaYuklenmeTarihi: new FormControl(),
    dosyaDuzenlenmeTarihi: new FormControl(),
    dosyaYukleyenKadi: new FormControl(),
  });

  constructor(public servis: DatabaseService, public toast: MytoastService) {}

  ngOnInit() {
    this.DosyalariListele();
    this.servis.AktifUyeBilgi();
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

  UyeListele(id: number) {
    this.servis.UyeByDosyaId(id).subscribe((d) => {
      this.uyeler = d;
    });
  }

  DosyalariListele() {
    this.servis.DosyaListele().subscribe((d) => {
      this.dosyalar = d;
      for (let index = 0; index < this.dosyalar.length; index++) {
        this.UyeListele(this.dosyalar[index].userId);
      }
    });
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
        console.log(this.servis.aktifUye.kullaniciKadi);
        dosya.userId = this.servis.aktifUye.id;
        console.log(this.servis.aktifUye.id);
        dosya.dosyaYuklenmeTarihi = tarih.getTime().toString();
        dosya.dosyaDuzenlenmeTarihi = tarih.getTime().toString();
        this.servis.DosyaEkle(dosya).subscribe((d) => {
          this.sonuc.islem = true;
          this.sonuc.mesaj = 'Dosya Eklendi';
          this.toast.ToastUygula(this.sonuc);
          this.DosyalariListele();
          this.modal.toggle();
        });
      }
    } else {
      dosya.dosyaDuzenlenmeTarihi = tarih.getTime().toString();
      this.servis.DosyaDuzenle(dosya).subscribe((d) => {
        this.sonuc.islem = true;
        this.sonuc.mesaj = 'Dosya Düzenlendi';
        this.toast.ToastUygula(this.sonuc);
        this.DosyalariListele();
        this.modal.toggle();
      });
    }
  }
  DosyaSil() {
    this.servis.DosyaSil(this.secDosya.id).subscribe((d) => {
      this.sonuc.islem = true;
      this.sonuc.mesaj = 'Dosya Silindi';
      this.toast.ToastUygula(this.sonuc);
      this.DosyalariListele();
      this.modal.toggle();
    });
  }

  DosyaIndir() {
    this.sonuc.islem = true;
    this.sonuc.mesaj = 'Dosya İndiriliyor';
    this.toast.ToastUygula(this.sonuc);
  }
}
