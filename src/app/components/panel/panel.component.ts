import { UyeModel } from './../../models/uyeModel';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Modal } from 'bootstrap';
import * as bootstrap from 'bootstrap';
import { Sonuc } from 'src/app/models/sonucModel';
import { MytoastService } from 'src/app/services/mytoast.service';
import { FirebaseServiceService } from 'src/app/services/FirebaseService.service';
import { switchMap } from 'rxjs';
import { HotToastService } from '@ngneat/hot-toast';

@Component({
  selector: 'app-panel',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.scss'],
})
export class PanelComponent implements OnInit {
  uye = this.fbServis.AktifUyeBilgi;
  uyeler!: UyeModel[];
  modal!: Modal;
  modalBaslik: string = '';
  secUye!: UyeModel;
  sonuc: Sonuc = new Sonuc();
  frm: FormGroup = new FormGroup({
    id: new FormControl(),
    displayName: new FormControl(),
    kullaniciSoyad: new FormControl(),
    kullaniciKadi: new FormControl(),
    kullaniciEmail: new FormControl(),
    kullaniciSifre: new FormControl(),
    kullaniciAdminMi: new FormControl(),
    kullaniciKayitTarihi: new FormControl(),
  });

  constructor(
    public fbServis: FirebaseServiceService,
    public toast: MytoastService,
    public htoast: HotToastService
  ) {}

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
    this.fbServis.ListOfMembers().subscribe((d) => {
      this.uyeler = d;
    });
  }

  UyeEkle() {
    var localUye: UyeModel = this.frm.value;
    // this.fbServis.AddMember(uye);
    var tarih = new Date();
    localUye.kullaniciKayitTarihi = tarih.getTime().toString();
    this.fbServis.KayitOl(localUye.kullaniciEmail!, localUye.kullaniciSifre!).pipe(
      switchMap(({ user: { uid } }) =>
        this.fbServis.AddMember({
          uid: uid,
          displayName: localUye.displayName,
          kullaniciSoyad: localUye.kullaniciSoyad,
          kullaniciKadi: localUye.kullaniciKadi,
          kullaniciEmail: localUye.kullaniciEmail,
          kullaniciSifre: localUye.kullaniciSifre,
          kullaniciAdminMi: localUye.kullaniciAdminMi,
          kullaniciKayitTarihi: localUye.kullaniciKayitTarihi,
          grupId: 1,
        })
      ),
      this.htoast.observe({
        success: 'Kayıt Yapıldı',
        loading: 'Kayıt Yapılıyor...',
        error: ({ message }) => `${message}`,
      })
    );
  }

  UyeDuzenle() {}

  UyeSil() {
    this.fbServis.DeleteMember(this.secUye).then((d) => {
      this.sonuc.islem = true;
      this.sonuc.mesaj = 'Üye Silindi';
      this.toast.ToastUygula(this.sonuc);
      this.UyeleriListele();
      this.modal.toggle();
    });
  }
}
