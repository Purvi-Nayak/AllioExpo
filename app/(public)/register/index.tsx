import { Container, RegistrationForm } from "@/components";
import React from "react";

export default function RegisterScreen() {
  return (
    <Container showHeader={false} auth keyboardAvoiding>
      <RegistrationForm />
    </Container>
  );
}