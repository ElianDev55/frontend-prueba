export interface SaucesResponse {
  data: Sauce[];
  date: string;
  status: number;
}

export interface Sauce {
  id: string;
  name: string;
  price: string;
  image: string;
  created_at: string;
  updated_at: string;
  is_deleted: null | string;
}
