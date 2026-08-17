import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  Inject,
  OnInit,
  inject
} from '@angular/core';

import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef
} from '@angular/material/dialog';

import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { ProductService } from '../../../../services/product.service';
import { SubCategoryService } from '../../../../services/sub-category.service';
import { CategoryService } from '../../../../services/category.service';


// ============================================================
// MODELS
// ============================================================

interface Category {
  id: number;
  name: string;
  description?: string;
}

interface SubCategory {
  id: number;
  name: string;
  categoryId: number;
  categoryName?: string;
}

interface Product {
  id: number;
  name: string;
  description?: string | null;
  price: number;
  stockQuantity: number;
  imageUrl?: string | null;
  subCategories?: SubCategory[];
}


// ============================================================
// COMPONENT
// ============================================================

@Component({
  selector: 'app-add-product',
  standalone: true,

  imports: [
    CommonModule,
    ReactiveFormsModule,

    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],

  templateUrl: './add-product.component.html',
  styleUrl: './add-product.component.scss'
})
export class AddProductComponent implements OnInit {

  // ==========================================================
  // SERVICES
  // ==========================================================

  private readonly fb = inject(FormBuilder);
  private readonly productService = inject(ProductService);
  private readonly categoryService = inject(CategoryService);
  private readonly subCategoryService = inject(SubCategoryService);
private readonly cdr =
  inject(ChangeDetectorRef);

  // ==========================================================
  // FORM
  // ==========================================================

  productForm!: FormGroup;


  // ==========================================================
  // DATA
  // ==========================================================

  categories: Category[] = [];

  filteredSubCategories: SubCategory[] = [];


  // ==========================================================
  // IMAGE
  // ==========================================================

  selectedFile: File | null = null;

  readonly PLACEHOLDER_IMAGE =
    'https://placehold.co/300x300?text=Upload+Image';

  imagePreview: string | ArrayBuffer | null =
    this.PLACEHOLDER_IMAGE;


  // ==========================================================
  // STATE
  // ==========================================================

  isSubmitting = false;

  errorMessage: string | null = null;


  // ==========================================================
  // CONSTRUCTOR
  // ==========================================================

  constructor(
    private readonly dialogRef:
      MatDialogRef<AddProductComponent>,

    @Inject(MAT_DIALOG_DATA)
    public data: {
      isEditing: boolean;
      product?: Product;
    }
  ) {}


  // ==========================================================
  // INIT
  // ==========================================================

  ngOnInit(): void {

    this.initializeForm();

    this.loadCategories();

    if (this.data?.isEditing && this.data?.product) {

      this.loadProductData(
        this.data.product
      );
    }
  }


  // ==========================================================
  // INITIALIZE FORM
  // ==========================================================

  private initializeForm(): void {

    this.productForm = this.fb.group({

      name: [
        '',
        [
          Validators.required,
          Validators.maxLength(200)
        ]
      ],

      price: [
        null,
        [
          Validators.required,
          Validators.min(0)
        ]
      ],

      stockQuantity: [
        null,
        [
          Validators.required,
          Validators.min(0)
        ]
      ],

      categoryId: [
        null,
        Validators.required
      ],

      subCategoryIds: [
        [],
        Validators.required
      ],

      description: [
        ''
      ]

    });
  }


  // ==========================================================
  // LOAD CATEGORIES
  // ==========================================================

 private loadCategories(): void {

  this.categoryService
    .getCategories()
    .subscribe({

      next: (categories: Category[]) => {

        this.categories = categories ?? [];

        const categoryId =
          this.productForm
            .get('categoryId')
            ?.value;

        if (categoryId) {

          this.loadSubCategories(
            categoryId
          );
        }

        // Tell Angular that the async data has changed
        this.cdr.detectChanges();
      },

      error: (error) => {

        console.error(
          'Failed to load categories:',
          error
        );

        this.errorMessage =
          error?.error?.message ??
          'Failed to load categories.';

        this.cdr.detectChanges();
      }

    });
}


  // ==========================================================
  // LOAD SUBCATEGORIES
  // ==========================================================

 private loadSubCategories(
  categoryId: number,
  selectedIds: number[] = []
): void {

  if (!categoryId) {

    this.filteredSubCategories = [];

    this.productForm
      .get('subCategoryIds')
      ?.setValue([]);

    this.cdr.detectChanges();

    return;
  }

  this.subCategoryService
    .getByCategoryId(categoryId)
    .subscribe({

      next: (subCategories: SubCategory[]) => {

        this.filteredSubCategories =
          subCategories ?? [];

        const validIds =
          selectedIds.filter(id =>
            this.filteredSubCategories.some(
              sc => sc.id === id
            )
          );

        this.productForm
          .get('subCategoryIds')
          ?.setValue(validIds);

        this.cdr.detectChanges();
      },

      error: (error) => {

        console.error(
          'Failed to load subcategories:',
          error
        );

        this.filteredSubCategories = [];

        this.productForm
          .get('subCategoryIds')
          ?.setValue([]);

        this.errorMessage =
          error?.error?.message ??
          'Failed to load subcategories.';

        this.cdr.detectChanges();
      }

    });
}


  // ==========================================================
  // CATEGORY CHANGE
  // ==========================================================

  onCategoryChange(
    categoryId: number
  ): void {

    this.errorMessage = null;

    this.productForm
      .get('subCategoryIds')
      ?.setValue([]);

    this.filteredSubCategories = [];

    if (!categoryId) {
      return;
    }

    this.loadSubCategories(
      categoryId
    );
  }


  // ==========================================================
  // LOAD PRODUCT FOR EDIT
  // ==========================================================

  private loadProductData(
    product: Product
  ): void {

    const selectedSubCategoryIds =
      product.subCategories
        ?.map(sc => sc.id) ?? [];

    const categoryId =
      this.getProductCategoryId(product);

    this.productForm.patchValue({

      name:
        product.name ?? '',

      price:
        product.price ?? 0,

      stockQuantity:
        product.stockQuantity ?? 0,

      categoryId:
        categoryId,

      description:
        product.description ?? '',

      subCategoryIds:
        []
    });

    if (categoryId) {

      this.loadSubCategories(
        categoryId,
        selectedSubCategoryIds
      );
    }

    if (product.imageUrl) {

      this.imagePreview =
        this.getImageUrl(
          product.imageUrl
        );
    }
  }


  // ==========================================================
  // GET PRODUCT CATEGORY
  // ==========================================================

  private getProductCategoryId(
    product: Product
  ): number | null {

    if (
      !product.subCategories ||
      product.subCategories.length === 0
    ) {
      return null;
    }

    return (
      product.subCategories[0]
        ?.categoryId ?? null
    );
  }


  // ==========================================================
  // FILE SELECTED
  // ==========================================================

  onFileSelected(
    event: Event
  ): void {

    const input =
      event.target as HTMLInputElement;

    if (
      !input.files ||
      input.files.length === 0
    ) {
      return;
    }

    const file =
      input.files[0];

    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/webp'
    ];

    if (
      !allowedTypes.includes(
        file.type
      )
    ) {

      this.errorMessage =
        'Only JPG, PNG and WEBP images are allowed.';

      input.value = '';

      return;
    }

    const maxSize =
      5 * 1024 * 1024;

    if (file.size > maxSize) {

      this.errorMessage =
        'Image size must not exceed 5 MB.';

      input.value = '';

      return;
    }

    this.selectedFile = file;

    this.errorMessage = null;

    const reader =
      new FileReader();

    reader.onload = () => {

      this.imagePreview =
        reader.result;
    };

    reader.readAsDataURL(file);
  }


  // ==========================================================
  // SAVE
  // ==========================================================

  save(): void {

    if (this.productForm.invalid) {

      this.productForm.markAllAsTouched();

      return;
    }

    if (this.isSubmitting) {
      return;
    }

    this.errorMessage = null;

    this.isSubmitting = true;

    const value =
      this.productForm.getRawValue();

    const formData =
      new FormData();


    // ========================================================
    // BASIC INFORMATION
    // ========================================================

    formData.append(
      'Name',
      String(value.name ?? '').trim()
    );

    formData.append(
      'Description',
      String(value.description ?? '')
    );

    formData.append(
      'Price',
      String(value.price ?? 0)
    );

    formData.append(
      'StockQuantity',
      String(value.stockQuantity ?? 0)
    );


    // ========================================================
    // SUBCATEGORIES
    // ========================================================

    const subCategoryIds: number[] =
      value.subCategoryIds ?? [];

    subCategoryIds.forEach(id => {

      formData.append(
        'SubCategoryIds',
        String(id)
      );
    });


    // ========================================================
    // IMAGE
    // ========================================================

    if (this.selectedFile) {

      formData.append(
        'Image',
        this.selectedFile
      );
    }


    // ========================================================
    // CREATE
    // ========================================================

    if (!this.data?.isEditing) {

      this.productService
        .createProduct(formData)
        .subscribe({

          next: () => {

            this.isSubmitting = false;

            this.dialogRef.close(true);
          },

          error: (error) => {

            console.error(
              'Create product error:',
              error
            );

            this.errorMessage =
              error?.error?.message ??
              'Failed to create product.';

            this.isSubmitting = false;
          }

        });

      return;
    }


    // ========================================================
    // UPDATE
    // ========================================================

    const productId =
      this.data?.product?.id;

    if (!productId) {

      this.errorMessage =
        'Product ID is missing.';

      this.isSubmitting = false;

      return;
    }

    this.productService
      .updateProduct(
        productId,
        formData
      )
      .subscribe({

        next: () => {

          this.isSubmitting = false;

          this.dialogRef.close(true);
        },

        error: (error) => {

          console.error(
            'Update product error:',
            error
          );

          this.errorMessage =
            error?.error?.message ??
            'Failed to update product.';

          this.isSubmitting = false;
        }

      });
  }


  // ==========================================================
  // CANCEL
  // ==========================================================

  cancel(): void {

    if (this.isSubmitting) {
      return;
    }

    this.dialogRef.close();
  }


  // ==========================================================
  // SUBCATEGORY NAME
  // ==========================================================

  getSubCategoryName(
    id: number
  ): string {

    return (
      this.filteredSubCategories
        .find(
          subCategory =>
            subCategory.id === id
        )
        ?.name ?? 'Selected'
    );
  }


  // ==========================================================
  // IMAGE URL
  // ==========================================================

  private getImageUrl(
    imageUrl: string
  ): string {

    if (
      imageUrl.startsWith('http://') ||
      imageUrl.startsWith('https://')
    ) {

      return imageUrl;
    }

    return `https://localhost:7256${imageUrl}`;
  }
}