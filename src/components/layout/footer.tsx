export function Footer() {
  return (
    // Make footer slightly distinct or transparent, use muted text
    <footer className="py-6 md:px-8 md:py-0 border-t border-white/10 bg-background/50 backdrop-blur-sm mt-16">
      <div className="container flex flex-col items-center justify-center gap-4 md:h-24 md:flex-row">
        <p className="text-center text-sm leading-loose text-muted-foreground">
          © {new Date().getFullYear()} Mathenge Inc. All rights reserved.
        </p>
        {/* Optional: Add social links or other footer elements here */}
      </div>
    </footer>
  );
}
