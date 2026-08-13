import { Component, OnInit, inject } from '@angular/core';

import { CategoryService } from '../../../../services/category.service';
import { Category } from '../../../../models/category.model';
import { SharedModule } from '../../../../shared/shared.module';
import { AddCategoryComponent } from '../add-category/add-category.component';
import { MatTableDataSource } from '@angular/material/table';
import { ConfirmDeleteComponent } from '../../../../shared/confirm-delete/confirm-delete.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-category-management',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './category-management.component.html',
  styleUrl: './category-management.component.scss'
})
export class CategoryManagementComponent implements OnInit {
  private categoryService = inject(CategoryService);

  categories: Category[] = [];
  displayedColumns: string[] = ['name',  'actions'];
  
  showDeleteConfirm = false;
  categoryToEdit: Category | null = null;
  categoryIdToDelete: number | null = null;
  dataSource = new MatTableDataSource<Category>();


constructor(private dialog :MatDialog) {
  
}  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    this.categoryService.getCategories().subscribe(cats => 
    {
          this.dataSource.data = cats;

    }
      );
  }
showAddCategory()
{
  this.categoryToEdit =null
this.dialog.open(AddCategoryComponent,{
  data:
  {
    category:this.categoryToEdit || null,
  add:true,
categories:this.categories
}
}).afterClosed().subscribe((res:any)=>
  {
  if (!res || !res.status) 
return;
    this.loadCategories();
    this.closeAddCategory();
  })
}
  onCategorySubmitted(category: Category) {
    if (this.categoryToEdit) {
      this.categoryService.updateCategory(category.id, category).subscribe(() => {
       // this.closeAddCategory();
        this.loadCategories();
        setTimeout(() => this.closeAddCategory());
      });
    } else {
      this.categoryService.addCategory(category).subscribe(() => {
     //   this.closeAddCategory();
        this.loadCategories();
        setTimeout(() => this.closeAddCategory());
      });
    }
  }

  editCategory(category: Category) {
    this.categoryToEdit = category;
 this.dialog.open(AddCategoryComponent,{
  data:
  {category:this.categoryToEdit || null,
   
  add:false,
categories:this.categories

}
}).afterClosed().subscribe((res:any)=>
  {
    if (!res || !res.status) return;
    this.loadCategories();
    this.closeAddCategory();
  })

  }

  
deleteCategory(id: any) {
    this.dialog.open(ConfirmDeleteComponent,
      {
data:  'Are you sure you want to delete this category?'
      }
      ).afterClosed().subscribe((res:any)=>
      {
        if(!res || !res.status) return;
        this.categoryService.deleteCategory(id).subscribe(() => {
      this.loadCategories();
      })
    })
  }



  closeAddCategory() {
    this.categoryToEdit = null;
  }
}
