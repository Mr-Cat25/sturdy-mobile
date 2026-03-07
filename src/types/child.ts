export interface ChildProfile {
  id: string;
  name: string;
  nickname: string;
  age: string;         // Guarantees this is a string (like "4-7")
  neurotype: string[]; // The brackets [] guarantee this is an array!
  isActive: boolean;
  createdAt?: string;  // The ? makes these optional just in case
  updatedAt?: string;
}