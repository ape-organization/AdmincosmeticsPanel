import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';

import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { ProductService } from '../../../../services/product.service';
import { CategoryService } from '../../../../services/category.service';
import { Product } from '../../../../models/product.model';
import { Category } from '../../../../models/category.model';
import { SharedModule } from '../../../../shared/shared.module';
import { firstValueFrom } from 'rxjs';
import { AddProductComponent } from '../add-product/add-product.component';
import { MatTableDataSource } from '@angular/material/table';
import { ConfirmDeleteComponent } from '../../../../shared/confirm-delete/confirm-delete.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-product-management',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './product-management.component.html',
  styleUrl: './product-management.component.scss'
})
export class ProductManagementComponent implements OnInit {
  private fb = inject(FormBuilder);
  private productService = inject(ProductService);
  private categoryService = inject(CategoryService);

  private readonly PLACEHOLDER_IMAGE = 'https://placehold.co/200x200?text=Upload+Image';

  products: Product[] = [];
  categories: Category[] = [];
  displayedColumns: string[] = ['image', 'name', 'price', 'category', 'stock', 'actions'];
  
  editingProductId: number | null = null;
  productToEdit: any = null;
  showDeleteConfirm: boolean = false;
  productIdToDelete: number | null = null;
  apiBaseUrl ='https://localhost:7256'
  dataSource = new MatTableDataSource<Product>();

  constructor( private cdr: ChangeDetectorRef,
    private dialog:MatDialog
  ) {}

  ngOnInit() {
    this.loadData();
  }

  async loadData() {
    
       this.categories = await firstValueFrom(this.categoryService.getCategories());
      this.cdr.detectChanges();
this.productService.getProducts().subscribe(products => {
    this.dataSource.data = products;
  });
 
  }
showAddProduct()
{
  this.productToEdit=null
  this.editingProductId=null
this.dialog.open(AddProductComponent,{
  data:
  {productID:this.editingProductId || null,
    product:this.productToEdit,
  add:true,
categories:this.categories
}
}).afterClosed().subscribe((res:any)=>
  {
  if (!res || !res.status) 
return;
    this.loadData();
    this.closeAddProduct();
  })
}

 

  editProduct(product: Product) {
    product.imageUrl=this.apiBaseUrl+product.imageUrl;
    this.editingProductId = product.id;
    this.productToEdit = product;


  this.dialog.open(AddProductComponent,{
  data:
  {productID:this.editingProductId || null,
    product:this.productToEdit,
  add:false,
categories:this.categories

}
}).afterClosed().subscribe((res:any)=>
  {
    if (!res || !res.status) return;
    this.loadData();
    this.closeAddProduct();
  })


  }

  closeAddProduct() {
    this.editingProductId = null;
    this.productToEdit = null;
  }

 
  deleteProduct(id: any) {
    this.productIdToDelete = id;
    this.dialog.open(ConfirmDeleteComponent,
      {
data:  'Are you sure you want to delete this product?'
      }
      ).afterClosed().subscribe((res:any)=>
      {
        if(!res || !res.status) return;
        this.productService.deleteProduct(id).subscribe(() => {
        this.loadData();
      })
    })
  }



}
