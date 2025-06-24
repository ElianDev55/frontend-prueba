import type { DynamicTemplateData } from '../interfaces/email.interface';

interface BillDataItem {
  diches: string;
  add: string;
  souces: string;
  drinks: string;
  chips: string;
  price: string;
  quantity: number;
  billDetailTotal: string;
  billTotal: string;
  createdBy: string;
  createdByEmail: string;
  createdByPhone: string;
  createdByAddress: string;
}

interface BillResponse {
  data: BillDataItem[];
}

export function transformBillResponse(response: BillResponse): DynamicTemplateData | null {
  if (!response.data || response.data.length === 0) {
    return null;
  }

  const firstItem = response.data[0];

  const user = {
    name: firstItem.createdBy,
    phone: firstItem.createdByPhone,
    email: firstItem.createdByEmail,
    address: firstItem.createdByAddress || '',
  };

  const products = response.data.flatMap((item) => {
    const productItems: { name: string; quantity: number; price: number }[] = [];
    const price = parseFloat(item.price) || 0;

    if (item.diches) {
      productItems.push({ name: item.diches, quantity: item.quantity, price });
    }
    if (item.add) {
      productItems.push({ name: item.add, quantity: item.quantity, price: 0 });
    }
    if (item.souces) {
      productItems.push({ name: item.souces, quantity: item.quantity, price: 0 });
    }
    if (item.drinks) {
      productItems.push({ name: item.drinks, quantity: item.quantity, price });
    }
    if (item.chips) {
      productItems.push({ name: item.chips, quantity: item.quantity, price });
    }

    return productItems.filter((p) => p.name);
  });

  const consolidatedProducts = products.reduce((acc, product) => {
    const existingProduct = acc.find((p) => p.name === product.name);
    if (existingProduct) {
      existingProduct.quantity += product.quantity;
    } else {
      acc.push({ ...product });
    }
    return acc;
  }, [] as { name: string; quantity: number; price: number }[]);

  const total = parseFloat(firstItem.billTotal);

  return {
    user,
    products: consolidatedProducts,
    total,
  };
}
