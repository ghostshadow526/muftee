import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useFirebaseAuth";

const Index = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { currentUser, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  // Sample images for slideshow (you can replace with your actual images)
  const images = [
    "/img2.webp", // Primary high-quality hero background (optimized webp)
    "/img.jpg",
    "/placeholder.svg",
  ];

  // Auto-rotate images
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval);
  }, [images.length]);

  // Redirect authenticated users to appropriate dashboard
  useEffect(() => {
    if (currentUser) {
      navigate(isAdmin ? '/admin' : '/dashboard');
    }
  }, [currentUser, isAdmin, navigate]);

  const handleLogout = async () => {
    try { await logout(); } catch (e) { console.error(e); }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[radial-gradient(circle_at_15%_20%,hsl(var(--primary)/0.12),transparent_60%),radial-gradient(circle_at_85%_35%,hsl(var(--accent)/0.10),transparent_65%),hsl(var(--background))]">
      {/* Top Navigation */}
      <header className="header-professional sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xl font-semibold text-gradient tracking-tight">ComplaintHub</span>
            <span className="hidden sm:inline-flex px-2 py-1 rounded-full text-[10px] font-medium bg-secondary/80 text-secondary-foreground tracking-wider uppercase">Professional Platform</span>
          </div>
          <div className="flex items-center gap-3">
            {currentUser ? (
              <>
                <span className="text-sm text-muted-foreground hidden md:inline">{currentUser.displayName || 'User'}</span>
                <button onClick={handleLogout} className="btn btn-outline !py-2 text-xs uppercase tracking-wide">Logout</button>
              </>
            ) : (
              <>
                <a href="/login" className="btn btn-outline !py-2 text-xs uppercase tracking-wide">Login</a>
                <a href="/signup" className="btn btn-primary !py-2 text-xs uppercase tracking-wide shadow-glow">Get Started</a>
                <a href="/admin-login" className="btn btn-ghost !py-2 text-xs uppercase tracking-wide">Admin</a>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
            <section className="relative overflow-hidden">
              <div className="absolute inset-0 opacity-60 mix-blend-normal">
                {images.map((image, index) => (
                  <div key={index} className={`absolute inset-0 transition-opacity duration-[1400ms] ease-out ${index === currentImageIndex ? 'opacity-40' : 'opacity-0'}`} style={{ backgroundImage:`url(${image})`, backgroundSize:'cover', backgroundPosition:'center'}} />
                ))}
                <div className="absolute inset-0 bg-[linear-gradient(120deg,hsl(var(--background)/0.85),hsl(var(--background)/0.9))]" />
              </div>
              <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28 md:py-36 flex flex-col items-center text-center">
                <div className="max-w-3xl mx-auto">
                  <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-tight mb-6 animate-fade-in-up">
                    A Modern System For <span className="text-gradient">Actionable Complaints</span>
                  </h1>
                  <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-8 animate-fade-in-up animation-delay-300">
                    Empower your users and teams with a transparent, auditable, and responsive complaint lifecycle. From submission to resolution—streamlined, measurable, and secure.
                  </p>
                  {!currentUser && (
                    <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up animation-delay-600">
                      <a href="/signup" className="btn btn-primary shadow-glow px-8 py-4 text-base font-semibold">Create Account</a>
                      <a href="/login" className="btn btn-outline px-8 py-4 text-base font-semibold">Sign In</a>
                    </div>
                  )}
                  {currentUser && (
                    <div className="animate-fade-in-up animation-delay-600">
                      <button onClick={() => navigate(isAdmin ? '/admin' : '/dashboard')} className="btn btn-primary shadow-glow px-8 py-4 text-base font-semibold">Go to Dashboard</button>
                    </div>
                  )}
                </div>
                <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 w-full animate-fade-in-up animation-delay-600">
                  {[{label:'Complaints Resolved', value:'12,500+'},{label:'Satisfaction Rate', value:'98%'},{label:'Avg. Response', value:'< 48hrs'},{label:'Active Watch', value:'24/7'}].map((stat,i)=>(
                    <div key={stat.label} className="card-professional p-5 text-center animate-fade-in-up" style={{animationDelay:`${400 + i*120}ms`}}>
                      <div className="text-2xl md:text-3xl font-semibold text-gradient mb-1">{stat.value}</div>
                      <div className="text-[11px] tracking-wide uppercase text-muted-foreground font-medium">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Features */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
              <div className="max-w-2xl mb-14">
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Why Teams Choose <span className="text-gradient">ComplaintHub</span></h2>
                <p className="text-muted-foreground text-lg leading-relaxed">Deliver clarity and accountability across the entire complaint lifecycle with structured workflows, real-time insights, and secure infrastructure.</p>
              </div>
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {[
                  {title:'Structured Intake', desc:'Smart categorization, priority tagging, and enriched metadata ensure nothing gets lost.', icon:'🧩'},
                  {title:'Live Status Tracking', desc:'Instant synchronization keeps stakeholders aligned without status meetings.', icon:'📡'},
                  {title:'Actionable Analytics', desc:'Resolve bottlenecks faster with trend analysis and SLA performance metrics.', icon:'📊'},
                  {title:'Role-Based Access', desc:'Least-privilege controls protect sensitive submissions and internal notes.', icon:'🔐'},
                  {title:'Scalable Architecture', desc:'Built on Firebase for reliability, security, and global performance.', icon:'⚙️'},
                  {title:'Audit Transparency', desc:'Every change is timestamped to provide compliance trails and accountability.', icon:'🗂️'}
                ].map((f,i)=>(
                  <div key={f.title} className="card-professional p-6 flex flex-col gap-4 animate-fade-in-up" style={{animationDelay:`${100*i}ms`}}>
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl bg-gradient-to-br from-primary/15 to-accent/15 text-gradient shadow-sm">{f.icon}</div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2 leading-snug">{f.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Process Flow */}
            <section className="relative bg-[linear-gradient(180deg,hsl(var(--background)),hsl(var(--background-alt)))] py-24">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-2xl mb-14">
                  <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">From Submission to Resolution</h2>
                  <p className="text-muted-foreground text-lg">A clean, auditable lifecycle ensures momentum and measurable outcomes.</p>
                </div>
                <div className="grid gap-8 md:grid-cols-3">
                  {[
                    {step:'01', title:'Submit', desc:'Users create structured complaints with category, priority & context.'},
                    {step:'02', title:'Track', desc:'Real-time status updates and notes keep everyone aligned.'},
                    {step:'03', title:'Resolve', desc:'Actioned, documented, and archived for analytics & compliance.'}
                  ].map((s,i)=>(
                    <div key={s.step} className="card-professional p-6 relative overflow-visible animate-fade-in-up" style={{animationDelay:`${150*i}ms`}}>
                      <div className="absolute -top-5 left-6 w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent text-white flex items-center justify-center text-sm font-semibold shadow-glow">{s.step}</div>
                      <h3 className="mt-6 font-semibold text-lg mb-2">{s.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Testimonial */}
            <section className="py-24">
              <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="card-professional p-10 md:p-14 text-center relative overflow-hidden">
                  <div className="absolute inset-0 pointer-events-none opacity-40 bg-[radial-gradient(circle_at_30%_20%,hsl(var(--primary)/0.25),transparent_60%),radial-gradient(circle_at_70%_65%,hsl(var(--accent)/0.22),transparent_65%)]" />
                  <div className="relative">
                    <p className="text-xl md:text-2xl font-medium leading-relaxed text-foreground/90 max-w-3xl mx-auto">
                      “We reduced complaint resolution time by <span className="text-gradient font-semibold">43%</span> after adopting ComplaintHub. The transparency and structured workflow changed how our teams operate.”
                    </p>
                    <div className="mt-8 flex flex-col items-center gap-2">
                      <span className="text-sm font-semibold tracking-wide uppercase text-foreground/80">Operations Director</span>
                      <span className="text-xs text-muted-foreground tracking-wider">Mid-Market SaaS Company</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Final Call To Action */}
            <section className="py-20">
              <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">Ready to Elevate Your Complaint Handling?</h2>
                <p className="text-muted-foreground text-lg leading-relaxed mb-8">Start modernizing your resolution pipeline with structured workflows, transparency, and analytics-driven improvement.</p>
                {!currentUser ? (
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <a href="/signup" className="btn btn-primary px-10 py-5 text-base font-semibold shadow-glow">Create Free Account</a>
                    <a href="/login" className="btn btn-outline px-10 py-5 text-base font-semibold">Sign In</a>
                  </div>
                ) : (
                  <button onClick={() => navigate(isAdmin ? '/admin' : '/dashboard')} className="btn btn-primary px-10 py-5 text-base font-semibold shadow-glow">Open Dashboard</button>
                )}
              </div>
            </section>
    </div>
  );
};

export default Index;