import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CartService } from 'src/app/services/cart.service';
import { CheckoutService } from 'src/app/services/checkout.service';
import { LoginService } from 'src/app/services/login.service';
import { datapay, vnPayService } from 'src/app/services/vnpay.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent {
  checkoutForm!: FormGroup;
  user!: any;
  tokendata: any;
  Carts: any;
  products: any
  choosepay!:any;
  datapay:datapay={amount:0,bankCode:'pay',language:'vn',orderId:0}
  constructor(private fb: FormBuilder, private cartService: CartService, private loginSV: LoginService, private checkout: CheckoutService, private route: Router, private vnpayService:vnPayService,
    private routeActive: ActivatedRoute

  ) {
  }
  ngOnInit() {
    this.user = this.loginSV.checkLogin();
    this.returnURL();
    this.tokendata = this.loginSV.decodeToken();
    this.Carts = this.cartService.getCart();
    this.checkoutForm = this.fb.group({
      fullname: [this.user.account_name, Validators.required],
      address: [this.tokendata.address, Validators.required],
      email: [this.tokendata.email, [Validators.required, Validators.email]],
      phone: [this.tokendata.phone_number, Validators.required],
      payment_method: ['', Validators.required],
      account_id: [this.user.account_id]
    });
    this.loadCart();
  }

  loadCart() {
    const cartData = this.cartService.getCart()
    if (cartData !== null) {
      this.products = JSON.parse(cartData);
    }

  }
  getTotalPrice() {
    const cartData = this.cartService.getCart()
    var cart = JSON.parse(cartData);
    const totalPrice = cart.reduce((acc: any, product: any) => {
        return acc + product.price * product.quantity;
    }, 0);
    return totalPrice;
}
  onSubmit() {
    const customerInfo = this.checkoutForm.value;
    this.choosepay==1? customerInfo.payment_method="Thanh toán VNPAY":customerInfo.payment_method="Thanh toán khi nhận hàng"
    // if (this.checkoutForm.invalid) {
    //   return;
    // }
    
    const checkoutData = this.cartService.checkout(customerInfo);
    if (checkoutData) {
      debugger
      this.checkout.createbill(checkoutData).subscribe({
        next: (res: any) => {
          if (res) {
            if(this.choosepay==1){
              this.datapay.orderId= res.bill_id,
              this.datapay.amount=res.total_amount;
              this.vnpayService.createURL(this.datapay).subscribe({
              next:(value)=>{
                if(value){
                  window.open(value, '_self')
                }
              }
            })
            }else{
              alert(res.message);
              localStorage.removeItem('cart');
              this.route.navigate(['/cart'])
            }
          }
        }
      })
    }
  }
  onSelectPaymentMethod(event: any) {
    this.choosepay = event.target.value;
    console.log('Bạn đã chọn:', this.choosepay);
  }
  increaseQuantity(item: any) {
    const cart = localStorage.getItem('cart');
    if (cart !== null) {
      const list = JSON.parse(cart);
      for (const x of list) {
        if (x.product_id === item.product_id) {
          x.quantity += 1;
          break;
        }
      }
      localStorage.setItem('cart', JSON.stringify(list));
    }
  }

  decreaseQuantity(item: any) {
    const cart = localStorage.getItem('cart');
    if (cart !== null) {
      const list = JSON.parse(cart);
      for (const x of list) {
        if (x.product_id === item.product_id) {
          x.quantity -= 1;
          if (x.quantity <= 0) {
            const index = list.indexOf(x);
            list.splice(index, 1);
          }
          break;
        }
      }
      localStorage.setItem('cart', JSON.stringify(list));
    }
  }

 returnURL(){
 const params = this.routeActive.snapshot.queryParams;
 if(Object.keys(params).length > 0){
  this.vnpayService.vnpay_ipn(params).subscribe({
    next:(res)=>{
    if(res){
      alert(res.Message);
            localStorage.removeItem('cart');
            this.route.navigate(['/cart'])
    }}
    })
 }
     
 }



}
