import { DatabaseService } from 'src/app/services/data.service';
import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from "@angular/router";


@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    public servis: DatabaseService
  ) {

  }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    var sonuc: boolean = false;
    if (this.servis.OturumKontrol()) {
      sonuc = true;
    } else {
      location.href = "/login";
    }
    return sonuc;
  }

}
