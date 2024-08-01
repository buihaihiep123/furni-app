import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { AboutComponent } from './components/about/about.component';
import { BlogComponent } from './components/blog/blog.component';
import { ShopComponent } from './components/shop/shop.component';
import { LoginComponent } from './components/login/login.component';
import { DetailproductComponent } from './components/detailproduct/detailproduct.component';
import { CartComponent } from './components/cart/cart.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { SignupComponent } from './components/signup/signup.component';
import { UserComponent } from './components/user/user.component';
import { UserUpdateComponent } from './components/user-update/user-update.component';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { NewsComponent } from './components/news/news.component';
import { NewsDetailComponent } from './components/news-detail/news-detail.component';


const routes: Routes = [

  {path:'',component:HomeComponent},
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'change-password', component: ChangePasswordComponent },
  { path: 'user-update/:id', component: UserUpdateComponent },
  { path: 'user/:id', component: UserComponent },
  { path: 'signup', component: SignupComponent },
  {path:'about',component:AboutComponent},
  {path:'blog',component:BlogComponent},
  {path:'shop',component:ShopComponent},
  {path:'login',component:LoginComponent},
  {path:'product/:id',component:DetailproductComponent},
  {path:'cart',component:CartComponent},
  {path:'checkout',component:CheckoutComponent},
  {path:'news',component:NewsComponent},
  { path: 'newsdetail/:id', component: NewsDetailComponent },
  { path: 'products/category/:id', component: ProductListComponent },
  { path: '', redirectTo: '/', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
