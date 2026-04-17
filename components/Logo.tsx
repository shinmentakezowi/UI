import Image from "next/image";

export function Logo({ size = 32 }: { size?: number }) {
  return (
    <Image
      src="/favicon.svg"
      alt="Hapuppy"
      width={size}
      height={size}
      className="rounded-lg"
      priority
    />
  );
}
