export interface DrinksResponse {
  data: Drink[];
  date: string;
  status: number;
}

export interface Drink {
  id: string;
  name: string;
  price: string;
  image: string;
  created_at: string;
  updated_at: string;
  is_deleted: null | string;
}
