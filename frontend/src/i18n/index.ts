import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Translation resources
const resources = {
  en: {
    translation: {
      welcome: 'Welcome',
      dashboard: 'Dashboard',
      appointments: 'Appointments',
      profile: 'Profile',
      logout: 'Logout',
      login: 'Login',
      register: 'Register',
      email: 'Email',
      password: 'Password',
      firstName: 'First Name',
      lastName: 'Last Name',
      phone: 'Phone',
      submit: 'Submit',
      cancel: 'Cancel',
      save: 'Save',
      delete: 'Delete',
      edit: 'Edit',
      search: 'Search',
      filter: 'Filter',
      loading: 'Loading...',
      error: 'Error',
      success: 'Success',
      // Medical Aid
      medicalAid: 'Medical Aid',
      scheme: 'Scheme',
      memberNumber: 'Member Number',
      policyNumber: 'Policy Number',
      // Triage
      symptomChecker: 'Symptom Checker',
      describeSymptoms: 'Describe your symptoms',
      checkSymptoms: 'Check Symptoms',
      urgency: 'Urgency',
      recommendedAction: 'Recommended Action',
      // Payments
      payment: 'Payment',
      amount: 'Amount',
      paymentMethod: 'Payment Method',
      pay: 'Pay',
      // Common
      status: 'Status',
      date: 'Date',
      time: 'Time',
      notes: 'Notes',
    },
  },
  af: {
    translation: {
      welcome: 'Welkom',
      dashboard: 'Dashboard',
      appointments: 'Afsprake',
      profile: 'Profiel',
      logout: 'Teken uit',
      login: 'Teken in',
      register: 'Registreer',
      email: 'E-pos',
      password: 'Wagwoord',
      firstName: 'Voornaam',
      lastName: 'Van',
      phone: 'Telefoon',
      submit: 'Dien in',
      cancel: 'Kanselleer',
      save: 'Stoor',
      delete: 'Skrap',
      edit: 'Wysig',
      search: 'Soek',
      filter: 'Filter',
      loading: 'Laai...',
      error: 'Fout',
      success: 'Sukses',
      // Medical Aid
      medicalAid: 'Mediese Hulp',
      scheme: 'Skema',
      memberNumber: 'Lidnommer',
      policyNumber: 'Polisnommer',
      // Triage
      symptomChecker: 'Simptoom Kontroleerder',
      describeSymptoms: 'Beskryf jou simptome',
      checkSymptoms: 'Kontroleer Simptome',
      urgency: 'Dringendheid',
      recommendedAction: 'Aanbevole Aksie',
      // Payments
      payment: 'Betaling',
      amount: 'Bedrag',
      paymentMethod: 'Betaling Metode',
      pay: 'Betaal',
      // Common
      status: 'Status',
      date: 'Datum',
      time: 'Tyd',
      notes: 'Notas',
    },
  },
  ng: {
    translation: {
      welcome: 'Mwaalelepo',
      dashboard: 'Oshikwata',
      appointments: 'Omapitikilo',
      profile: 'Oshiholelwa',
      logout: 'Ela',
      login: 'Shiingila',
      register: 'Shiikitha',
      email: 'Omaili',
      password: 'Oshiholelwa',
      firstName: 'Edhina lyokutanga',
      lastName: 'Edhina lyokugwanitha',
      phone: 'Otelefona',
      submit: 'Tuma',
      cancel: 'Kansela',
      save: 'Humbata',
      delete: 'Dhenga',
      edit: 'Lungulula',
      search: 'Konga',
      filter: 'Shunga',
      loading: 'Ota tungwa...',
      error: 'Epuko',
      success: 'Oshikwata',
      // Medical Aid
      medicalAid: 'Oshikwata shomukithi',
      scheme: 'Oshikwata',
      memberNumber: 'Omukithi womukithi',
      policyNumber: 'Oshikwata shomukithi',
      // Triage
      symptomChecker: 'Oshikwata shomukithi',
      describeSymptoms: 'Falulula omukithi',
      checkSymptoms: 'Konga omukithi',
      urgency: 'Oshikwata',
      recommendedAction: 'Oshikwata',
      // Payments
      payment: 'Oshikwata',
      amount: 'Oshikwata',
      paymentMethod: 'Oshikwata',
      pay: 'Oshikwata',
      // Common
      status: 'Oshikwata',
      date: 'Oshikwata',
      time: 'Oshikwata',
      notes: 'Oshikwata',
    },
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: localStorage.getItem('language') || 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;

