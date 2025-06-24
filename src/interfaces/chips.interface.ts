export interface ChipsResponse {
  data: Chip[];
  date: string;
  status: number;
}

export interface Chip {
  id: string;
  name: string;
  price: string;
  image: string;
  created_at: string;
  updated_at: string;
  is_deleted: null | string;
}
