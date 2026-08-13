import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { AddSubCategory } from '../add-sub-category/add-sub-category';
interface Category {
  id: number;
  name: string;
  description?: string;
}

interface Subcategory {
  id: number;
  name: string;
  description?: string;
  categoryId: number;
  categoryName?: string;
}
@Component({
  selector: 'app-all-sub-category',
  imports: [ CommonModule,
    ReactiveFormsModule,

    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule],
  templateUrl: './all-sub-category.html',
  styleUrl: './all-sub-category.scss',
})
export class AllSubCategory {

 private readonly fb = inject(FormBuilder);
  private readonly dialog = inject(MatDialog);

  displayedColumns: string[] = [
    'name',
    'category',
    'description',
    'actions'
  ];

  dataSource = new MatTableDataSource<Subcategory>([]);

  categories: Category[] = [];

  subcategories: Subcategory[] = [];

  subcategoryForm!: FormGroup;

  isEditing = false;

  selectedSubcategory: Subcategory | null = null;


  ngOnInit(): void {

    this.initializeForm();

    this.loadCategories();

    this.loadSubcategories();

  }


  // ==========================================
  // FORM
  // ==========================================

  initializeForm(): void {

    this.subcategoryForm = this.fb.group({

      categoryId: [
        null,
        Validators.required
      ],

      name: [
        '',
        [
          Validators.required,
          Validators.minLength(2)
        ]
      ],

      description: [
        ''
      ]

    });

  }


  // ==========================================
  // LOAD CATEGORIES
  // ==========================================

  loadCategories(): void {

    /*
      Replace this with your CategoryService.

      Example:

      this.categoryService.getAllCategories()
        .subscribe(categories => {
          this.categories = categories;
        });
    */

    this.categories = [
      {
        id: 1,
        name: 'Skincare',
        description: 'Skin care products'
      },
      {
        id: 2,
        name: 'Makeup',
        description: 'Makeup products'
      },
      {
        id: 3,
        name: 'Hair Care',
        description: 'Hair care products'
      },
      {
        id: 4,
        name: 'Fragrance',
        description: 'Perfumes and fragrances'
      }
    ];

  }


  // ==========================================
  // LOAD SUBCATEGORIES
  // ==========================================

  loadSubcategories(): void {

    /*
      Replace this with your SubcategoryService.

      Example:

      this.subcategoryService.getAll()
        .subscribe(data => {
          this.subcategories = data;
          this.dataSource.data = data;
        });
    */

    this.subcategories = [
      {
        id: 1,
        name: 'Face Creams',
        description: 'Moisturizing and nourishing creams',
        categoryId: 1,
        categoryName: 'Skincare'
      },

      {
        id: 2,
        name: 'Serums',
        description: 'Face and skin serums',
        categoryId: 1,
        categoryName: 'Skincare'
      },

      {
        id: 3,
        name: 'Lipstick',
        description: 'Lip colors',
        categoryId: 2,
        categoryName: 'Makeup'
      },

      {
        id: 4,
        name: 'Foundation',
        description: 'Face foundation products',
        categoryId: 2,
        categoryName: 'Makeup'
      }
    ];

    this.dataSource.data = this.subcategories;

  }


  // ==========================================
  // ADD
  // ==========================================

  showAddSubcategory(): void {

    this.isEditing = false;

    this.selectedSubcategory = null;

    this.subcategoryForm.reset();

    this.openSubcategoryDialog();

  }


  // ==========================================
  // EDIT
  // ==========================================

  editSubcategory(
    subcategory: Subcategory
  ): void {

    this.isEditing = true;

    this.selectedSubcategory = subcategory;

    this.subcategoryForm.patchValue({

      categoryId: subcategory.categoryId,

      name: subcategory.name,

      description: subcategory.description ?? ''

    });

    this.openSubcategoryDialog();

  }


  // ==========================================
  // DIALOG
  // ==========================================

 openSubcategoryDialog(): void {

  const dialogRef = this.dialog.open(
    AddSubCategory,
    {
      width: '500px',
      maxWidth: '95vw',

      data: {
        categories: this.categories,

        subcategory:
          this.selectedSubcategory,

        isEditing:
          this.isEditing
      }
    }
  );


  dialogRef.afterClosed()
    .subscribe(result => {

      if (!result) {
        return;
      }

      if (this.isEditing) {

        this.updateSubcategory(result);

      } else {

        this.createSubcategory(result);

      }

    });

}


  // ==========================================
  // CREATE
  // ==========================================

 createSubcategory(data: any): void {

  const category = this.categories.find(
    c => c.id === data.categoryId
  );

  const newSubcategory: Subcategory = {
    id: Date.now(),
    name: data.name,
    description: data.description,
    categoryId: data.categoryId,
    categoryName: category?.name
  };

  this.subcategories.push(newSubcategory);

  this.dataSource.data = [
    ...this.subcategories
  ];
}


  // ==========================================
  // UPDATE
  // ==========================================

 updateSubcategory(data: any): void {

  if (!this.selectedSubcategory) {
    return;
  }

  const category = this.categories.find(
    c => c.id === data.categoryId
  );

  const index = this.subcategories.findIndex(
    item =>
      item.id === this.selectedSubcategory!.id
  );

  if (index === -1) {
    return;
  }

  this.subcategories[index] = {
    ...this.subcategories[index],

    name: data.name,

    description: data.description,

    categoryId: data.categoryId,

    categoryName: category?.name
  };

  this.dataSource.data = [
    ...this.subcategories
  ];
}


  // ==========================================
  // DELETE
  // ==========================================

  deleteSubcategory(
    id: number
  ): void {

    const confirmed =
      confirm(
        'Are you sure you want to delete this subcategory?'
      );

    if (!confirmed) {
      return;
    }

    this.subcategories =
      this.subcategories.filter(
        item => item.id !== id
      );

    this.dataSource.data = [
      ...this.subcategories
    ];

  }


  // ==========================================
  // CATEGORY NAME
  // ==========================================

  getCategoryName(
    categoryId: number
  ): string {

    return (
      this.categories.find(
        category =>
          category.id === categoryId
      )?.name ?? 'Unknown'
    );

  }

}
