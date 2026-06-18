// ─────────────────────────────────────────────
//  types/index.ts
//
//  Centralised TypeScript types for the app.
//  Add every screen name + its params here.
// ─────────────────────────────────────────────

// ── Navigation ────────────────────────────────

export type RootStackParamList = {
  SignUp: undefined;                   // no params needed
  EmailSent: { email: string };        // receives the email the user signed up with
  Login: undefined;
  Home: undefined;
};