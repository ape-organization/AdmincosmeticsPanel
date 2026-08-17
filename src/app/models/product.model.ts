export interface Product {
  id: number;
  name: string;
  description?: string;
  price: number;
  stockQuantity: number;
  imageUrl?: string;

  subCategories: SubCategoryResponse[];
}

export interface SubCategoryResponse {
  id: number;
  name: string;
  categoryId: number;
  categoryName: string;
}

export interface ProductDto {
  id?: number;
  name: string;
  description?: string;
  price: number;
  stockQuantity: number;
  imageUrl?: string;
  image?: File | null;
  subCategoryIds: number[];
}