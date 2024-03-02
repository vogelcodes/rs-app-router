export interface HotmartSales {
  producer: Producer;
  purchase: Purchase;
  buyer: Buyer;
  product: Product;
}

export interface Buyer {
  ucode: string;
  email: string;
  name: string;
}

export interface Producer {
  ucode: string;
  name: string;
}

export interface Product {
  id: number;
  name: string;
}

export interface Purchase {
  hotmart_fee: HotmartFee;
  commission_as: string;
  status: string;
  order_date: number;
  warranty_expire_date: number;
  is_subscription: boolean;
  price: Price;
  offer: Offer;
  approved_date: number;
  payment: Payment;
  transaction: string;
}

export interface HotmartFee {
  total: number;
  fixed: number;
  base: number;
  currency_code: string;
  percentage: number;
}

export interface Offer {
  code: string;
  payment_mode: string;
}

export interface Payment {
  installments_number: number;
  type: string;
  method: string;
}

export interface Price {
  currency_code: string;
  value: number;
}
