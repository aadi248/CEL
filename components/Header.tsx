import Image from "next/image";
import Link from "next/link";

export function Header({ progress }: { progress?: string }) {
  return (
    <header className="site-header">
      <Link className="brand" href="/" aria-label="CEL Six-Piece Hunt home">
        <Image src="/api/logo" alt="CEL logo" width={42} height={42} priority />
        <span className="brand-mark">
          CEL
          <br />
          BITS GOA
        </span>
      </Link>
      <nav className="nav" aria-label="Primary navigation">
        <Link href="/">THE HUNT</Link>
        <Link href="/leaderboard">LEADERBOARD</Link>
        {progress ? <span aria-label={`Progress ${progress}`}>{progress}</span> : null}
      </nav>
    </header>
  );
}
