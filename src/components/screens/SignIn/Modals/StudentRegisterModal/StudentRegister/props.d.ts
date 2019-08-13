import { Student } from 'config';

export interface StudentRegisterProps {
	signInId: string;
	close: () => void;
	studentRegister: (student: Student) => Promise<void>;
}

export interface studentRegisterStates {
  first_name: string;
  last_name: string;
  email: string;
  [key: string]: string;
}