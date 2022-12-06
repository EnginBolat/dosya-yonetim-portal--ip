import { ProfileComponent } from './components/profile/profile.component';
import { PanelComponent } from './components/panel/panel.component';
import { LoginComponent } from './components/login/login.component';
import { AuthGuard } from './services/auth.guard';
import { MytoastService } from './services/mytoast.service';
import { DatabaseService } from 'src/app/services/data.service';
import { HomeComponent } from './components/home/home.component';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { HotToastModule } from '@ngneat/hot-toast';

@NgModule({
  declarations: [AppComponent, HomeComponent, LoginComponent,PanelComponent,ProfileComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    HotToastModule.forRoot(),
  ],
  providers: [DatabaseService, MytoastService, AuthGuard],
  bootstrap: [AppComponent],
})
export class AppModule {}
