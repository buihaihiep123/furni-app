import { Component } from '@angular/core';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent {
  constructor(private service: CartService){}
  products! :any[]
  total:number = 0;


  ngOnInit(){
    this.loadCart()
    this.total = this.service.getTotalPrice();
  }
  loadCart(){
    const cartData = this.service.getCart()
    if (cartData !== null) {
      this.products = JSON.parse(cartData);
    }
   
  }
  removeProduct(id:any) {
    this.service.removeItem(id);
    this.loadCart()
  }
  clearCart(): void {
    this.service.clearCart();
    this.loadCart();
  }
  Upquantity(item: any) {
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
    this.loadCart();

    }
}

Downquantity(item: any) {
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
    this.loadCart();

    }
}




 


}
