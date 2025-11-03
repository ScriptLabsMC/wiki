import Link from "next/link";

export default function FormLink() {
  return (
    <Link href="/form"
    className="person-badge"
    style={{
      textDecoration: "none"
    }}
    >
      <strong>Únete Ahora</strong>
    </Link>
  );
}