export interface DishInterface {
  id: string;
  name: string;
  price: string;
  image: string;
  created_at: string;
  updated_at: string;
  is_deleted: string | null;
  created_by: string;
}

export interface DishesInterface {
  data: DishInterface[];
  date: string;
  status: number;
}
