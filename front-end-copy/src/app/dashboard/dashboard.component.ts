import { Component, OnInit } from '@angular/core';
import { FormBuilder,Validators } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit{
    isCollapse:boolean=true;
    user=''
    currentAcno:string=''
    balance:number=0
    fundTransferSuccessMsg:string=''
    fundTransferErrorMsg:string=''

    logoutStatus:boolean=false;

    //variables for delete acc
    acno:any
    deleteConfirmStatus:boolean=false;
    deleteSuccessMsg:string=''

    constructor(private fundfb:FormBuilder,private api:ApiService, private loginRouter:Router, http:HttpClientModule, private dashboardRouter:Router){}

    ngOnInit(): void {
      if(!localStorage.getItem('token')){   
        alert('Please Login')
        this.dashboardRouter.navigateByUrl('')

      }
      if(localStorage.getItem('currentUser')){
        this.user=localStorage.getItem('currentUser')||''
        console.log(this.user)
      }
      if(localStorage.getItem('currentAcno')){
        this.currentAcno=localStorage.getItem('currentAcno')||''
      }

    }


    
    fundForm=this.fundfb.group({                                            //form group
      creditacc:['',[Validators.required,Validators.pattern('[0-9]*')]],   //form array
      amount:['',[Validators.required,Validators.pattern('[0-9]*')]],
      password:['',[Validators.required,Validators.pattern('[a-zA-Z0-9]*')]]      //form control in html page
    })                                                                          
    //
    collapse(){
      this.isCollapse=!this.isCollapse
    }
    //api call to get balance
    getBalance(){
      this.api.getBalance(this.currentAcno).subscribe((result:any)=>{
        this.balance=result.balance;
      })
    }
    

    fundTransfer(){
      if(this.fundForm.valid){
        let creditacc=this.fundForm.value.creditacc
        let amount=this.fundForm.value.amount
        let password=this.fundForm.value.password

        this.api.fundTransfer(creditacc,password,amount).subscribe((result:any)=>{
          console.log(result);
          this.fundTransferSuccessMsg=result.message; //successful
          setTimeout(()=>{
            this.fundForm.reset()
            this.fundTransferSuccessMsg=''
          },2000)
        },
        (result:any)=>{
          console.log(result.error.message);
          this.fundTransferErrorMsg=result.error.message; //error
          setTimeout(()=>{
            // this.fundForm.reset()
            this.fundTransferErrorMsg=''
          },2000)
        }
        )
      }
      else{
        alert('Please provide a valid data')
      }
      
      
    }

    resetForm(){
      this.fundForm.reset()
    }

    //logout fn
    logout(){
      this.logoutStatus=true;
      localStorage.clear();
      setTimeout(()=>{
        this.dashboardRouter.navigateByUrl('');
      },2000)
    }

    //delete user account
    deleteAccount(){
      //data to be shared with child (considering dashboard as parent and other components as childs,here it is delete acc)
      this.acno=localStorage.getItem('currentAcno');
      this.deleteConfirmStatus=true;
      
    }
    cancelDelete(){
      this.acno=''
      this.deleteConfirmStatus=false;
    }

    deleteFromParent(){
      this.api.deleteUserAccount().subscribe((result:any)=>{
        this.deleteSuccessMsg=result.message;
        localStorage.clear()
        setTimeout(()=>{
          this.dashboardRouter.navigateByUrl('')
        },3000)
      })
    }
}
