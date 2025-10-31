export type OnboardingStackParamList = {
  Welcome: undefined;
  Login: undefined;
  SignUpStep1: undefined;
  SignUpStep2: {
    name: string;
    gender: 'male' | 'female';
    birthDate: string;
    phone: string;
  };
  SignUpStep3: {
    name: string;
    gender: 'male' | 'female';
    birthDate: string;
    phone: string;
    password: string;
  };
  SignUpSuccess: undefined;
};