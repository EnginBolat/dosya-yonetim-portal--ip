import { DosyaModel } from './../models/dosyaModel';
import { UyeModel } from './../models/uyeModel';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'

@Injectable({
  providedIn: 'root',
})
export class DatabaseService {
  public apiUrl = "http://localhost:3000/";
  public aktifUye: UyeModel = new UyeModel();;
  constructor(
    public http: HttpClient
  ) { }

  OturumAc(mail: string, parola: string) {
    return this.http.get<UyeModel[]>(this.apiUrl + "users?kullaniciEmail=" + mail + "&kullaniciSifre=" + parola);
  }
  OturumKontrol() {
    if (localStorage.getItem("kadi")) {
      this.AktifUyeBilgi()
      return true;
    } else {
      return false;
    }
  }
  AktifUyeBilgi() {
    if (localStorage.getItem("kadi")) {
      this.aktifUye.kullaniciKadi = localStorage.getItem("kadi") || "";
      var admin = localStorage.getItem("adminMi") || "0";
      this.aktifUye.kullaniciAdminMi = parseInt(admin);
    }
  }

  // AktifUyeAdminMi(){
  //   if(localStorage.getItem(admin))
  // }

  UyeListele() {
    return this.http.get<UyeModel[]>(this.apiUrl + "users");
  }
  UyeById(id: number) {
    return this.http.get<UyeModel>(this.apiUrl + "users/" + id);
  }
  UyeEkle(uye: UyeModel) {
    return this.http.post(this.apiUrl + "users/", uye);
  }
  UyeDuzenle(uye: UyeModel) {
    return this.http.put(this.apiUrl + "users/" + uye.id, uye);
  }
  UyeSil(id: number) {
    return this.http.delete(this.apiUrl + "users/" + id);
  }
  UyeByDosyaId(id:number){
    return this.http.get<UyeModel[]>(this.apiUrl + "users/"+id+"/files")
  }
  // File Service

  DosyaListele() {
    return this.http.get<DosyaModel[]>(this.apiUrl + "files");
  }
  DosyaById(id: number) {
    return this.http.get<DosyaModel>(this.apiUrl + "files/" + id);
  }
  DosyaEkle(dosya: DosyaModel) {
    return this.http.post(this.apiUrl + "files/", dosya);
  }
  DosyaDuzenle(dosya: DosyaModel) {
    return this.http.put(this.apiUrl + "files/" + dosya.id, dosya);
  }
  DosyaSil(id: number) {
    return this.http.delete(this.apiUrl + "files/" + id);
  }
}