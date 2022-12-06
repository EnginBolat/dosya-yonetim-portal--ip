import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Modal } from 'bootstrap';
import * as bootstrap from 'bootstrap';
import { Sonuc } from 'src/app/models/sonucModel';
import { DatabaseService } from 'src/app/services/data.service';
import { MytoastService } from 'src/app/services/mytoast.service';
import { UyeModel } from 'src/app/models/uyeModel';

@Component({
  selector: 'app-panel',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.scss']
})

export class PanelComponent implements OnInit {
 
  uyeler!: UyeModel[];
  modal!: Modal;
  modalBaslik: string = '';
  secUye!: UyeModel;
  sonuc: Sonuc = new Sonuc();
  frm: FormGroup = new FormGroup({
    id: new FormControl(),
    kullaniciAdi: new FormControl(),
    kullaniciSoyad: new FormControl(),
    kullaniciKadi: new FormControl(),
    kullaniciEmail: new FormControl(),
    kullaniciSifre: new FormControl(),
    kullaniciAdminMi: new FormControl(),
    kullaniciKayitTarihi: new FormControl(),
  });

  constructor(public servis: DatabaseService, public toast: MytoastService) {}

  ngOnInit() {
    this.UyeleriListele();
  }

  Ekle(el: HTMLElement) {
    this.frm.reset();
    this.modal = new bootstrap.Modal(el);
    this.modalBaslik = 'Üye Ekle';
    this.modal.show();
  }
  Duzenle(uye: UyeModel, el: HTMLElement) {
    this.frm.patchValue(uye);
    this.modalBaslik = 'Üye Düzenle';
    this.modal = new bootstrap.Modal(el);
    this.modal.show();
  }
  Sil(uye: UyeModel, el: HTMLElement) {
    this.secUye = uye;
    this.modalBaslik = 'Üye Sil';
    this.modal = new bootstrap.Modal(el);
    this.modal.show();
  }

  UyeleriListele() {
    this.servis.UyeListele().subscribe((d) => {
      this.uyeler = d;
    });
  }


  UyeEkleDuzenle() {
    var uye: UyeModel = this.frm.value;
    var tarih = new Date();
    if (!uye.id) {
      var filtre = this.uyeler.filter((s) => s.kullaniciEmail == uye.kullaniciEmail);
      if (filtre.length > 0) {
        this.sonuc.islem = false;
        this.sonuc.mesaj = 'Girilen Üye Kayıtlıdır!';
        this.toast.ToastUygula(this.sonuc);
      } else {
        uye.kullaniciKayitTarihi = tarih.getTime().toString();
        this.servis.UyeEkle(uye).subscribe((d) => {
          this.sonuc.islem = true;
          this.sonuc.mesaj = 'Üye Eklendi';
          this.toast.ToastUygula(this.sonuc);
          this.UyeleriListele();
          this.modal.toggle();
        });
      }
    } else {
      uye.kullaniciKayitTarihi = tarih.getTime().toString();
      this.servis.UyeDuzenle(uye).subscribe((d) => {
        this.sonuc.islem = true;
        this.sonuc.mesaj = 'Üye Düzenlendi';
        this.toast.ToastUygula(this.sonuc);
        this.UyeleriListele();
        this.modal.toggle();
      });
    }
  }
  DosyaSil() {
    this.servis.UyeSil(this.secUye.id).subscribe((d) => {
      this.sonuc.islem = true;
      this.sonuc.mesaj = 'Üye Silindi';
      this.toast.ToastUygula(this.sonuc);
      this.UyeleriListele();
      this.modal.toggle();
    });
  }
}