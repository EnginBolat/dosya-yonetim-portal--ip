import { DosyaModel } from './../models/dosyaModel';
import { Injectable } from '@angular/core';
import {
  collection,
  collectionData,
  deleteDoc,
  deleteField,
  doc,
  docData,
  Firestore,
  query,
  setDoc,
  where,
} from '@angular/fire/firestore';
import { concatMap, from, map, Observable, of, switchMap, take } from 'rxjs';
import { addDoc, updateDoc } from '@firebase/firestore';
import {
  Auth,
  authState,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  User,
  UserInfo,
} from '@angular/fire/auth';
import {
  getStorage,
  getDownloadURL,
  ref,
  Storage,
  uploadBytes,
} from '@angular/fire/storage';
import { UyeModel } from '../models/uyeModel';
import { url } from 'inspector';

@Injectable({
  providedIn: 'root',
})
export class FirebaseServiceService {
  aktifUye = authState(this.auth);
  dosyaYukleyenKadi: any = '';
  constructor(
    public fs: Firestore,
    public auth: Auth,
    public storage: Storage
  ) {}

  KayitOl(mail: string, parola: string) {
    return from(createUserWithEmailAndPassword(this.auth, mail, parola));
  }
  OturumAc(mail: string, parola: string) {
    return from(signInWithEmailAndPassword(this.auth, mail, parola));
  }
  OturumKapat() {
    return from(this.auth.signOut());
  }

  get AktifUyeBilgi() {
    return this.aktifUye.pipe(
      switchMap((user) => {
        if (!user?.uid) {
          return of(null);
        }
        const ref = doc(this.fs, 'Uyeler', user?.uid);
        return docData(ref) as Observable<UyeModel>;
      })
    );
  }

  // Member

  ListOfUsers() {
    var ref = collection(this.fs, 'Uyeler');
    return this.aktifUye.pipe(
      concatMap((user) => {
        const myQuery = query(ref);
        return collectionData(myQuery, { idField: 'uid' }) as Observable<
          UyeModel[]
        >;
      })
    );
  }

  ListOfMembers() {
    var ref = collection(this.fs, 'Uyeler');
    return collectionData(ref, { idField: 'uid' }) as Observable<UyeModel[]>;
  }

  AddMember(uye: UyeModel) {
    var ref = doc(this.fs, 'Uyeler', uye.uid!);
    return from(setDoc(ref, uye));
  }

  EditMember(uye: UyeModel) {
    var ref = doc(this.fs, 'Uyeler', uye.uid!);
    return from(updateDoc(ref, { ...uye }));
  }

  DeleteMember(uye: UyeModel) {
    var ref = doc(this.fs, 'Uyeler', uye.uid!);
    return deleteDoc(ref);
  }

  // File

  ListOfFiles() {
    var ref = collection(this.fs, 'Dosyalar');
    return this.aktifUye.pipe(
      concatMap((user) => {
        const myQuery = query(ref);
        return collectionData(myQuery, { idField: 'id' }) as Observable<
          DosyaModel[]
        >;
      })
    );
  }

  UploadFile(dosya: DosyaModel, path: String, event: any) {
    var ref = collection(this.fs, 'Dosyalar');
    return this.aktifUye.pipe(
      take(1),
      concatMap((user) =>
        addDoc(ref, {
          // dosyaId: dosya.id,
          dosyaAdi: dosya.dosyaAdi,
          dosyaAdminOzelMi: dosya.dosyaAdminOzelMi,
          dosyaBoyut: dosya.dosyaBoyut,
          dosyaBoyutTuru: dosya.dosyaBoyutTuru,
          dosyaDuzenlenmeTarihi: dosya.dosyaDuzenlenmeTarihi,
          dosyaYuklenmeTarihi: dosya.dosyaYuklenmeTarihi,
          dosyaYukleyenKadi: dosya.dosyaYukleyenKadi,
          // dosyaYukleyenKadi: this.dosyaYukleyenKadi,
          dosyaUrl: path,
          userId: user?.uid,
        })
      ),
      map((ref) => ref.id)
    );
  }

  EditFile(dosya: DosyaModel) {
    var ref = doc(this.fs, 'Dosyalar/' + dosya.id);
    return updateDoc(ref, { ...dosya });
  }

  DeleteFile(dosya: DosyaModel) {
    var ref = doc(this.fs, 'Dosyalar/' + dosya.id);
    return deleteDoc(ref);
  }

  DownloadFile(dosya: DosyaModel) {
    const storage = getStorage();
    getDownloadURL(ref(storage, 'images/profile/' + dosya.id))
      .then((url) => {
        // `url` is the download URL for 'images/stars.jpg'

        // This can be downloaded directly:
        const xhr = new XMLHttpRequest();
        xhr.responseType = 'blob';
        xhr.onload = (event) => {
          const blob = xhr.response;
        };
        xhr.open('GET', url);
        xhr.send();

        // Or inserted into an <img> element
        const img = document.getElementById('myimg');
        img?.setAttribute('src', url);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  UploadImage(
    image: File,
    path: string,
    dosya: DosyaModel,
    event: any
  ): Observable<string> {
    const storageRef = ref(this.storage, path);
    const uploadTask = from(uploadBytes(storageRef, image));
    return uploadTask.pipe(switchMap((result) => getDownloadURL(result.ref)));
  }
}
