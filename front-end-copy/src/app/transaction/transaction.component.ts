import { Component,OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import jspdf from 'jspdf';
import 'jspdf-autotable';
import { Router } from '@angular/router';
@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.css']
})
export class TransactionComponent implements OnInit {
  transaction:any=[]
  searchTerm:string='';
  logoutStatus:boolean=false
  constructor(private api:ApiService,private transRouter:Router){}
  ngOnInit(): void {
    if(!localStorage.getItem('token')){
      alert('Please Login')
      this.transRouter.navigateByUrl('')

    }
    this.api.getTransactionHistory().subscribe((result:any)=>{
      console.log(result); 
      this.transaction=result.transaction; //transaction array

    },
    (result:any)=>{
      console.log(result.error.message);
    }
    )
  }
  search(event:any){
    this.searchTerm=event.target.value;
  }

  //generate pdf
  generatePDF(){
    //1. create an object for jspdf
    var pdf= new jspdf
    //2. setup title row for the table
    let thead=['Type','From Account','To Account','Amount']

    let tbody=[];
    //3. setup pdf properties
    pdf.setFontSize(16) 
    pdf.text('Mini Statement',15,10)  //fontsize(16 will be assigned to this)
    pdf.setFontSize(12) //next properties will acquire this font size
    pdf.setTextColor(99)

    //4. to display as table , need to convert array of object to nested array
    for(let item of this.transaction){
      let temp=[item.type,item.fromAcno,item.toAcno,item.amount]
      tbody.push(temp) //nested array created for pdf  ng-only nested array can be converted ton pdf
    }

    //5.convert nested array to table using jspdf-autotable
    (pdf as any).autoTable(thead,tbody,{startY:15})

    //6. to open pdf in new tab
    pdf.output('dataurlnewwindow')

    //7. to save pdf
    pdf.save('Transaction History.pdf')

  }

   //logout fn
   logout(){
    this.logoutStatus=true;

    localStorage.clear();
    setTimeout(()=>{
      this.transRouter.navigateByUrl('');
    },2000)
  }


}
