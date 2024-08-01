import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class CartService {

    constructor() { }

    addToCart(item: any) {
        // Kiểm tra trạng thái của sản phẩm.
        if (item.status === 0) {
            alert('Sản phẩm tạm thời hết hàng!');
            return;
        }

        // Lấy giỏ hàng từ local storage.
        const cart = localStorage.getItem('cart');
        let list: any[] = [];
    
        // Sao chép sản phẩm để không thay đổi trực tiếp `detailproduct`.
        const itemToAdd = { ...item, quantity: 1 };
    
        // Nếu giỏ hàng không tồn tại, tạo một danh sách mới.
        if (cart === null) {
            list = [itemToAdd];
        } else {
            // Phân tích giỏ hàng từ JSON.
            list = JSON.parse(cart);
    
            // Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa.
            let found = false;
            for (const x of list) {
                if (x.product_id === itemToAdd.product_id) {
                    x.quantity += 1;
                    found = true;
                    break;
                }
            }
    
            // Nếu sản phẩm chưa có trong giỏ hàng, thêm nó vào.
            if (!found) {
                list.push(itemToAdd);
            }
        }
    
        // Lưu giỏ hàng vào local storage.
        localStorage.setItem('cart', JSON.stringify(list));
    
        // Thông báo cho người dùng rằng sản phẩm đã được thêm vào giỏ hàng.
        alert('Đã thêm giỏ hàng thành công!');
    }

    getTotalPrice() {
        const cartData = this.getCart()
        var cart = JSON.parse(cartData);
        const totalPrice = cart.reduce((acc: any, product: any) => {
            return acc + product.price * product.quantity;
        }, 0);
        return totalPrice;
    }

    removeItem(id: number) {
        const cartData = this.getCart()
        if (cartData !== null) {
            var cart = JSON.parse(cartData);
            const index = cart.findIndex((product: any) => product.product_id === id);
            if (index >= 0) {
                cart.splice(index, 1);
            }

            // Lưu trữ giỏ hàng vào localStorage
            localStorage.setItem('cart', JSON.stringify(cart));
        }
    }

    clearCart() {
        localStorage.removeItem('cart');
        alert('Giỏ hàng đã được xóa sạch!');
    }

    getCart(): any {
        return localStorage.getItem('cart');
    }

    checkout(customerInfo: any): any {
        const cartData = this.getCart();
        if (!cartData) {
            return null;
        }
        const cart = JSON.parse(cartData);
        const totalAmount = this.getTotalPrice();
        const bill = {
            account_id: customerInfo.account_id,
            bill_date: new Date(),
            total_amount: totalAmount,
            status: 1,
            payment_method: customerInfo.payment_method
        };
        const billDetails = cart.map((item: any) => ({
            product_id: item.product_id,
            quantity: item.quantity,
            price: item.price,
            subtotal: item.price * item.quantity
        }));
        return { bill, billDetails };
    }
}
