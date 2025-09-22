const NotFound = () => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="text-center">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-primary opacity-20">404</h1>
        </div>
        <div className="card-professional p-8 max-w-md mx-auto">
          <h2 className="text-2xl font-bold text-foreground mb-4">Page Not Found</h2>
          <p className="text-muted-foreground mb-6">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <div className="space-y-3">
            <a
              href="/"
              className="btn btn-primary w-full shadow-glow"
            >
              Return to Home
            </a>
            <button
              onClick={() => window.history.back()}
              className="btn btn-outline w-full"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;