export type EquipmentOwner = {
  _id?: string;
  name?: string;
  email?: string;
  photo?: string;
};

export type EquipmentItem = {
  _id: string;
  name: string;
  description?: string;
  category: string;
  location: string;
  price: number;
  rentalType: "Daily" | "Weekly" | "Monthly";
  quantity: number;
  condition?: string;
  brand?: string;
  model?: string;
  image: string;
  terms?: string;
  status?: "Pending" | "Approved" | "Rejected";
  rating?: number;
  ownerId?: EquipmentOwner | string;
};

export type BookingRecord = {
  _id: string;
  totalAmount: number;
  paymentStatus?: string;
  bookingStatus?: string;
  transactionId?: string;
};
