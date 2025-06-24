export interface DynamicTemplateData {
  user: {
    name: string;
    phone: string;
    email: string;
    address: string;
  };
  products: {
    name: string;
    quantity: number;
    price: number;
  }[];
  total: number;
}

export interface EmailTemplate {
  to: string;
  from: string;
  subject: string;
  text: string;
  templateId: string;
  dynamicTemplateData: DynamicTemplateData;
}
