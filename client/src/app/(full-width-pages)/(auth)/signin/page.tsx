import SignInForm from "@/components/auth/SignInForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Alethea",
  description: "Alethea AI Bug Tracking Application",
};

export default function SignIn() {
  return <SignInForm />;
}
