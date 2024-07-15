import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { map } from 'rxjs/operators';
import { Products } from 'src/app/model/products';
import { ProductService } from './Service/Products.service';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit,OnDestroy{
  title = 'AngularHttpRequest';
  allProducts:Products[]=[];
  isFetching:boolean=false;
  editMode:boolean=false;
  currentProductId:string;
  errorMessage:string=null;
  errorSub:Subscription
  @ViewChild('productForm') form:NgForm;


  constructor(private http:HttpClient,private productService:ProductService){

  }
  ngOnInit() {
    this.fetchProducts();
    this.errorSub=this.productService.error.subscribe((message)=>{
      this.errorMessage= message;
    })
  }
  onProductsFetch(){
    this.fetchProducts();
  }
  onDeleteProduct(id:string){
    this.productService.deleteProduct(id);

  } 

  onDeleteAllProduct(){
    this.productService.deleteAllProduct();

  } 

  onProductCreate(products:{pName:string,desc:string,price:string}){
    if(!this.editMode){
      this.productService.createProduct(products);
    }
    else{
      this.productService.updateProduct(this.currentProductId,products);
    }
    
  }

  private fetchProducts(){
    this.isFetching = true; 
    this.productService.fecthProduct().subscribe((products)=>{
    this.allProducts = products
    this.isFetching = false;
    },(err)=>{
      this.errorMessage = err.message;
    })
  }

  onEditClicked(id:string){
    this.currentProductId=id;
    //Get the product based on the Id
    let currentProduct = this.allProducts.find((p)=>{return p.id === id});
      //console.log(this.form);

    //Populate the form with the product details
    this.form.setValue({
      pName:currentProduct.pName,
      desc:currentProduct.desc,
      price:currentProduct.price
    });

    //Change the button value to update product
    this.editMode =true;
  }
  ngOnDestroy(): void {
    this.errorSub.unsubscribe();
    
  }
}
