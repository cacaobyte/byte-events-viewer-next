import { Metadata } from "next"

import { SignUpForm } from "@/components/forms/sign-up-form"

export const metadata: Metadata = {
  title: "Sign Up",
  description: "Sign up for a new account",
}

export default function SignUpPage() {
  return <SignUpForm />
}
