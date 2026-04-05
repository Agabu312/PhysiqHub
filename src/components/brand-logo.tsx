import Link from "next/link";

type BrandLogoProps = {
  href?: string;
  className?: string;
};

export function BrandLogo({ href = "/", className = "" }: BrandLogoProps) {
  const inner = (
    <span
      className={`inline-flex items-center gap-2 font-semibold tracking-tight text-foreground ${className}`}
    >
      <span
        className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-soft text-sm text-accent ring-1 ring-teal-400/25"
        aria-hidden
      >
        P
      </span>
      PhysiquHub
    </span>
  );

  if (href) {
    return (
      <Link href={href} className="transition-opacity hover:opacity-90">
        {inner}
      </Link>
    );
  }

  return inner;
}
