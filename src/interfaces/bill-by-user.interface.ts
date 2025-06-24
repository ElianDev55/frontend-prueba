export interface BillsByUserResponse {
  data: {
    [key: string]: BillDetail[];
  };
  date: string;
  status: number;
}

export interface Bill {
  id: string;
  total: string;
  created_at: string;
  updated_at: string;
  is_deleted: string | null;
  created_by: string;
}

export interface BillDetail {
  id: string;
  bill_id: string;
  bill: Bill;
  diches_id: string | null;
  diches: Product | null;
  add_id: string | null;
  add: Product | null;
  souces_id: string | null;
  souces: Product | null;
  drinks_id: string | null;
  drinks: Product | null;
  chips_id: string | null;
  chips: Product | null;
  total: string;
  created_at: string;
  updated_at: string;
  is_deleted: string | null;
}

export interface Product {
  id: string;
  name: string;
  price: string;
  image?: string;
  created_at: string;
  updated_at: string;
  is_deleted: string | null;
  created_by?: string;
}
