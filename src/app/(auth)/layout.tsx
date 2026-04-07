export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="surface-grid flex min-h-screen items-center justify-center bg-muted/30 px-6 py-10">
      <div className="w-full max-w-5xl">{children}</div>
    </div>
  );
}
