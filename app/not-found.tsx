export default function NotFound() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-16 text-center">
      <h1 className="text-3xl font-semibold">Page not found</h1>
      <p className="text-muted-foreground mt-2">The page you’re looking for doesn’t exist.</p>
      <a href="/" className="inline-block mt-6 underline hover:text-primary">
        Go back home
      </a>
    </div>
  )
}
