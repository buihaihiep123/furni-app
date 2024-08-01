import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { HomeComponent } from './components/home/home.component';
import { AboutComponent } from './components/about/about.component';
import { BlogComponent } from './components/blog/blog.component';
import { ShopComponent } from './components/shop/shop.component';
import { LoginComponent } from './components/login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { DetailproductComponent } from './components/detailproduct/detailproduct.component';
import { CartComponent } from './components/cart/cart.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { SignupComponent } from './components/signup/signup.component';
import { UserComponent } from './components/user/user.component';
import { UserUpdateComponent } from './components/user-update/user-update.component';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { SearchFilterPipe } from './search-filter.pipe';
import { NewsComponent } from './components/news/news.component';
import { NewsDetailComponent } from './components/news-detail/news-detail.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    AboutComponent,
    BlogComponent,
    ShopComponent,
    LoginComponent,
    DetailproductComponent,
    CartComponent,
    CheckoutComponent,
    SignupComponent,
    UserComponent,
    UserUpdateComponent,
    ChangePasswordComponent,
    ForgotPasswordComponent,
    ProductListComponent,
    SearchFilterPipe,
    NewsComponent,
    NewsDetailComponent
    
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    NgxPaginationModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
