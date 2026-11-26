"use server";

export type ContactFormState = {
  success: boolean;
  message?: string;
  errors?: Record<string, string>;
};

export async function submitContactAction(
  prevState: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
  const name = formData.get("name")?.toString().trim();
  const email = formData.get("email")?.toString().trim();
  const subject = formData.get("subject")?.toString().trim();
  const message = formData.get("message")?.toString().trim();

  const errors: Record<string, string> = {};

  if (!name || name.length < 2) {
    errors.name = "Please provide your full name.";
  }

  if (!email || !email.includes("@")) {
    errors.email = "Please provide a valid email address.";
  }

  if (!message || message.length < 10) {
    errors.message = "Message must be at least 10 characters long.";
  }

  if (Object.keys(errors).length > 0) {
    return {
      success: false,
      errors,
    };
  }

  // Simulate server-side message dispatch or logging
  console.log("Customer inquiry received:", { name, email, subject, messageLength: message?.length });

  return {
    success: true,
    message: "Thank you for reaching out! Our customer support team has received your message and will respond within 24 hours.",
  };
}
