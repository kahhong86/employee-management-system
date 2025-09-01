export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  gender: "Male" | "Female" | "Other";
  dateOfBirth: string;
  joinedDate: string;
}
