export interface Product {
  id: string;
  name: string;
  image: string;
  created_at: string;
  updated_at: string;
  is_deleted: boolean | null;
}

export interface CardInterface {
  id: string;
  name: string;
  price: string;
  image: string;
  created_at: string;
  updated_at: string;
  is_deleted: boolean | null;
  created_by: string;
  products: Product[];
}

export interface CardApiResponse {
  data: CardInterface[];
  date: string;
  status: number;
}
