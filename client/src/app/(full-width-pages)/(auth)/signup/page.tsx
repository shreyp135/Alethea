import SignUpForm from "@/components/auth/SignUpForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Alethea",
  description: "Alethea AI Bug Tracking Application",
  // other metadata
};

export default function SignUp() {
  return <SignUpForm />;
}
