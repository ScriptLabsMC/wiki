// app/components/ClientWrapper.jsx
"use client";
import { useSvgReplacement } from "../../hooks/useSvgReplacement";

export default function ClientWrapper({ children }) {
  useSvgReplacement();
  return <>{children}</>;
}
