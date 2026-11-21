"use client";

import { Button, type ButtonProps } from "../ui/Button";
import { openConsultation } from "./consultation-events";

/** A Button that opens the consultation modal. Drop-in for the prototype's onBook buttons. */
export function BookButton(props: Omit<ButtonProps, "href" | "onClick">) {
  const consultationType = props.children === "Request an Office Consultation" ? "office"
    : props.children === "Book a Free Online Consultation" ? "online" : undefined;
  return <Button {...props} onClick={() => openConsultation(consultationType)} />;
}
