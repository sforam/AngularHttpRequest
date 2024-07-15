import { HttpClient,HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, map } from 'rxjs/operators';
import { Products } from '../model/products';
import { Subject, throwError } from "rxjs";

@Injectable({providedIn:"root"})
export class ProductService{    

    error= new Subject<string>();
    constructor(private http:HttpClient){

    }
    //Create Product from database
    createProduct(products:{pName:string,desc:string,price:string}){
        console.log(products)
        const headers = new HttpHeaders({'myHeader':'Foarm'});
        this.http.post<{name:string}>
        ('https://angularprojectt-312c3-default-rtdb.firebaseio.com/products.json',products,{headers:headers})
        .subscribe((res)=>{
    
          console.log(res);
        },(err)=>{
            this.error.next(err.message)
        })
    
    }
    
    //fetch Product from database
    fecthProduct(){
        const header = new HttpHeaders().set('content-type','application/json')
                                        .set('Access-Control-Allow-Origin','*')


        const params = new HttpParams().set('print','pretty').set('pageNum',1);
        return this.http.get<{[key:string]:Products}>('https://angularprojectt-312c3-default-rtdb.firebaseio.com/products.json?print=pretty',{'headers':header,params:params})
        .pipe(map((res)=>{
          const products =[];
          for(const key in res){
            if(res.hasOwnProperty(key)){
              products.push({...res[key],id:key})
            }
          }
          return products;
     
        }),catchError((err)=>{
            //write the logic for logging error

            return throwError(err)
        })  )
       
    }
    
    //delete Product from database
    deleteProduct(id:string){
        let header = new HttpHeaders()
        header = header.append('myHeader1','Value1');
        header = header.append('myHeader2','Value2');
        this.http.delete('https://angularprojectt-312c3-default-rtdb.firebaseio.com/products/'+id+'.json',{headers:header}).subscribe();

    }
    deleteAllProduct(){
        this.http.delete('https://angularprojectt-312c3-default-rtdb.firebaseio.com/products.json').subscribe();

    }
    updateProduct(id:string,value:Products){
        this.http.put('https://angularprojectt-312c3-default-rtdb.firebaseio.com/products/'+id+'.json',value).subscribe();
    }

}