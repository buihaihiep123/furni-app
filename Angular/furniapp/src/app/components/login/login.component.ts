import { Component } from '@angular/core';
import {FormGroup, FormControl, Validators } from '@angular/forms';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginF: FormGroup= new FormGroup({
    email: new FormControl('',[Validators.required,Validators.email]),
    password: new FormControl('',Validators.required)
  });
  constructor (private loginSrv: LoginService){}

  onLogin():void{
    if(this.loginF.invalid){return ;}
    this.loginSrv.login(this.loginF.value).subscribe(function(res:any){
      if(res.code==404){
        alert(res.message);
      }else{
        let jsonData=JSON.stringify(res);
        sessionStorage.setItem('login',jsonData);
        location.assign('http://localhost:4200');
      }
      console.log(res);
    })
    
  }
}
