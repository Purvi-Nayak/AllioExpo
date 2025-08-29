import { Container, LoginForm } from "@/components";
import React, { useState } from "react";

export default function LoginScreen() {
  const [loading, setLoading] = useState(false);

  return (
    <Container showHeader={false} auth keyboardAvoiding showLoader={loading}>
      <LoginForm />
    </Container>
  );
}