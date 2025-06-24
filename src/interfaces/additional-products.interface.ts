export interface AdditionalProductsResponse {
  data: AdditionalProduct[];
  date: string;
  status: number;
}

export interface AdditionalProduct {
  id: string;
  name: string;
  price: string;
  created_at: string;
  updated_at: string;
  is_deleted: null | string;
  created_by: string;
}
