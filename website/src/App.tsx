import { useState } from 'react';

const CUISINES = [
  { name: 'West African', emoji: '🍛', desc: 'Jollof rice, Suya, Egusi soup' },
  { name: 'Congolese', emoji: '🥘', desc: 'Moambe chicken, Fufu, Ndolé' },
  { name: 'North African', emoji: '🫕', desc: 'Tagine, Couscous, Pastilla' },
  { name: 'Ethiopian', emoji: '🍽️', desc: 'Injera, Doro Wat, Kitfo' },
  { name: 'Lusophone', emoji: '🦐', desc: 'Muamba, Cachupa, Piri Piri' },
  { name: 'Pan-African', emoji: '🌍', desc: 'Fusion dishes & street food' },
];

const STEPS = [
  { num: '01', title: 'Browse', desc: 'Explore African restaurants near you and discover authentic dishes from across the continent.', icon: '🔍' },
  { num: '02', title: 'Order', desc: 'Choose your favourites, customize your meal and pay securely with Stripe.', icon: '🛒' },
  { num: '03', title: 'Enjoy', desc: 'Track your delivery in real-time and enjoy authentic African cuisine at your doorstep.', icon: '🎉' },
];

const FEATURES = [
  { title: 'Real-time tracking', desc: 'Follow your order from kitchen to doorstep with live status updates.', icon: '📍' },
  { title: 'Curated restaurants', desc: 'Every restaurant is hand-picked for authenticity and quality.', icon: '⭐' },
  { title: 'Secure payments', desc: 'Pay with confidence using Stripe-powered secure checkout.', icon: '🔒' },
  { title: 'Multi-language', desc: 'Available in English, French, and Portuguese — your language, your food.', icon: '🌐' },
  { title: 'Dietary filters', desc: 'Easily find halal, vegan, gluten-free and other dietary options.', icon: '🥗' },
  { title: 'Pickup or delivery', desc: 'Choose what works best — get it delivered or pick it up yourself.', icon: '🚗' },
];

const TESTIMONIALS = [
  { name: 'Aminata D.', city: 'Paris', text: "Finally, authentic West African food delivered to my door. The Jollof rice from Chez Fatou is just like my grandmother's!", rating: 5 },
  { name: 'Pedro M.', city: 'Lisbon', text: "As an Angolan living in Portugal, Kolia connects me to home. The Muamba chicken is incredible.", rating: 5 },
  { name: 'Fatima B.', city: 'Brussels', text: "I discovered Congolese cuisine through Kolia and now I'm hooked. Great selection and fast delivery.", rating: 5 },
];

const RESTAURANTS_PREVIEW = [
  { name: 'Chez Fatou', cuisine: 'West African', city: 'Paris', rating: 4.8, img: 'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=400&h=300&fit=crop' },
  { name: 'Maman Congo', cuisine: 'Congolese', city: 'Brussels', rating: 4.7, img: 'https://images.unsplash.com/photo-1567364816519-cbc9c4ffe1eb?w=400&h=300&fit=crop' },
  { name: 'Riad Essaouira', cuisine: 'North African', city: 'Lyon', rating: 4.9, img: 'https://images.unsplash.com/photo-1541518763669-27fef04b14ea?w=400&h=300&fit=crop' },
  { name: 'Lagos Grill House', cuisine: 'West African', city: 'London', rating: 4.6, img: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=300&fit=crop' },
];

function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-surface/90 backdrop-blur-md border-b border-black/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            <a href="#" className="flex items-center gap-2">
              <img src="/logo.png" alt="Kolia" className="h-10 sm:h-12" />
            </a>
            <div className="hidden md:flex items-center gap-8">
              <a href="#cuisines" className="text-text-secondary hover:text-text-primary transition-colors text-sm font-medium">Cuisines</a>
              <a href="#how-it-works" className="text-text-secondary hover:text-text-primary transition-colors text-sm font-medium">How it works</a>
              <a href="#restaurants" className="text-text-secondary hover:text-text-primary transition-colors text-sm font-medium">Restaurants</a>
              <a href="#features" className="text-text-secondary hover:text-text-primary transition-colors text-sm font-medium">Features</a>
              <a href="#download" className="bg-primary hover:bg-primary-dark text-white px-6 py-2.5 rounded-full text-sm font-semibold transition-colors">
                Get the app
              </a>
            </div>
            <button
              className="md:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {mobileMenuOpen
                  ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                }
              </svg>
            </button>
          </div>
          {mobileMenuOpen && (
            <div className="md:hidden pb-4 flex flex-col gap-3">
              <a href="#cuisines" onClick={() => setMobileMenuOpen(false)} className="text-text-secondary hover:text-text-primary py-2 text-sm font-medium">Cuisines</a>
              <a href="#how-it-works" onClick={() => setMobileMenuOpen(false)} className="text-text-secondary hover:text-text-primary py-2 text-sm font-medium">How it works</a>
              <a href="#restaurants" onClick={() => setMobileMenuOpen(false)} className="text-text-secondary hover:text-text-primary py-2 text-sm font-medium">Restaurants</a>
              <a href="#features" onClick={() => setMobileMenuOpen(false)} className="text-text-secondary hover:text-text-primary py-2 text-sm font-medium">Features</a>
              <a href="#download" onClick={() => setMobileMenuOpen(false)} className="bg-primary text-white px-6 py-2.5 rounded-full text-sm font-semibold text-center">Get the app</a>
            </div>
          )}
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-28 sm:pt-36 pb-16 sm:pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium mb-6">
                <span>🌍</span> Now available across Europe
              </div>
              <h1 className="font-[family-name:var(--font-display)] text-4xl sm:text-5xl lg:text-6xl font-bold text-text-primary leading-tight mb-6">
                Authentic African
                <span className="text-primary"> Cuisine,</span>
                <br />Delivered to You
              </h1>
              <p className="text-text-secondary text-lg sm:text-xl leading-relaxed mb-8 max-w-lg">
                Discover the rich and diverse flavours of Africa. From West African Jollof to North African Tagine — order from the best African restaurants near you.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a href="#download" className="bg-primary hover:bg-primary-dark text-white px-8 py-4 rounded-full text-base font-semibold transition-all hover:shadow-lg hover:shadow-primary/25 text-center">
                  Order Now
                </a>
                <a href="#how-it-works" className="border-2 border-secondary text-secondary hover:bg-secondary hover:text-white px-8 py-4 rounded-full text-base font-semibold transition-all text-center">
                  How it works
                </a>
              </div>
              <div className="flex items-center gap-6 mt-10 text-sm text-text-secondary">
                <div className="flex items-center gap-2">
                  <span className="text-accent text-lg">★★★★★</span>
                  <span>4.8 rating</span>
                </div>
                <div className="w-px h-4 bg-text-tertiary/30"></div>
                <div>100+ restaurants</div>
                <div className="w-px h-4 bg-text-tertiary/30"></div>
                <div>10+ cities</div>
              </div>
            </div>
            <div className="relative hidden lg:block">
              <div className="absolute -top-8 -right-8 w-72 h-72 bg-primary/10 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-8 -left-8 w-56 h-56 bg-secondary/10 rounded-full blur-3xl"></div>
              <div className="relative bg-gradient-to-br from-primary/5 to-secondary/5 rounded-3xl p-8 border border-black/5">
                <div className="grid grid-cols-2 gap-4">
                  {RESTAURANTS_PREVIEW.map((r) => (
                    <div key={r.name} className="bg-surface rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow">
                      <img src={r.img} alt={r.name} className="w-full h-28 object-cover" />
                      <div className="p-3">
                        <p className="font-semibold text-sm text-text-primary truncate">{r.name}</p>
                        <p className="text-xs text-text-tertiary">{r.cuisine} · {r.city}</p>
                        <div className="flex items-center gap-1 mt-1">
                          <span className="text-accent text-xs">★</span>
                          <span className="text-xs font-medium">{r.rating}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cuisines */}
      <section id="cuisines" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-surface">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-[family-name:var(--font-display)] text-3xl sm:text-4xl font-bold text-text-primary mb-4">
              Explore African Cuisines
            </h2>
            <p className="text-text-secondary text-lg max-w-2xl mx-auto">
              Africa's culinary diversity is extraordinary. Discover flavours from every corner of the continent.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
            {CUISINES.map((c) => (
              <div key={c.name} className="group bg-background hover:bg-primary/5 rounded-2xl p-6 text-center transition-all cursor-pointer border border-transparent hover:border-primary/20">
                <span className="text-4xl sm:text-5xl block mb-3">{c.emoji}</span>
                <h3 className="font-semibold text-text-primary mb-1">{c.name}</h3>
                <p className="text-text-tertiary text-sm">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-[family-name:var(--font-display)] text-3xl sm:text-4xl font-bold text-text-primary mb-4">
              How Kolia Works
            </h2>
            <p className="text-text-secondary text-lg max-w-2xl mx-auto">
              Getting your favourite African food delivered is easy. Just three simple steps.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {STEPS.map((step, i) => (
              <div key={step.num} className="relative">
                {i < STEPS.length - 1 && (
                  <div className="hidden md:block absolute top-12 left-[60%] w-[80%] border-t-2 border-dashed border-primary/20"></div>
                )}
                <div className="bg-surface rounded-3xl p-8 text-center relative border border-black/5 hover:shadow-lg transition-shadow">
                  <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-5">
                    <span className="text-3xl">{step.icon}</span>
                  </div>
                  <span className="text-xs font-bold text-primary tracking-widest uppercase">Step {step.num}</span>
                  <h3 className="font-[family-name:var(--font-display)] text-xl font-bold text-text-primary mt-2 mb-3">{step.title}</h3>
                  <p className="text-text-secondary text-sm leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Restaurants */}
      <section id="restaurants" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-surface">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-[family-name:var(--font-display)] text-3xl sm:text-4xl font-bold text-text-primary mb-4">
              Featured Restaurants
            </h2>
            <p className="text-text-secondary text-lg max-w-2xl mx-auto">
              Hand-picked restaurants serving the most authentic African dishes in Europe.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {RESTAURANTS_PREVIEW.map((r) => (
              <div key={r.name} className="bg-background rounded-2xl overflow-hidden border border-black/5 hover:shadow-xl transition-all group cursor-pointer">
                <div className="h-48 overflow-hidden">
                  <img src={r.img} alt={r.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-5">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold text-text-primary">{r.name}</h3>
                    <div className="flex items-center gap-1 bg-accent/10 px-2 py-0.5 rounded-full">
                      <span className="text-accent text-xs">★</span>
                      <span className="text-xs font-semibold">{r.rating}</span>
                    </div>
                  </div>
                  <p className="text-text-secondary text-sm">{r.cuisine}</p>
                  <p className="text-text-tertiary text-xs mt-1">📍 {r.city}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-[family-name:var(--font-display)] text-3xl sm:text-4xl font-bold text-text-primary mb-4">
              Why Choose Kolia
            </h2>
            <p className="text-text-secondary text-lg max-w-2xl mx-auto">
              Built for food lovers who crave authentic African flavours.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f) => (
              <div key={f.title} className="bg-surface rounded-2xl p-6 border border-black/5 hover:border-primary/20 transition-colors">
                <span className="text-3xl mb-4 block">{f.icon}</span>
                <h3 className="font-semibold text-text-primary mb-2">{f.title}</h3>
                <p className="text-text-secondary text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-secondary">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-[family-name:var(--font-display)] text-3xl sm:text-4xl font-bold text-white mb-4">
              Loved by Thousands
            </h2>
            <p className="text-white/70 text-lg max-w-2xl mx-auto">
              Join our growing community of African food lovers across Europe.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                <div className="text-accent mb-3">{'★'.repeat(t.rating)}</div>
                <p className="text-white/90 text-sm leading-relaxed mb-4">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {t.name[0]}
                  </div>
                  <div>
                    <p className="text-white font-medium text-sm">{t.name}</p>
                    <p className="text-white/50 text-xs">{t.city}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA / Download */}
      <section id="download" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-br from-primary to-primary-dark rounded-3xl p-8 sm:p-16 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2"></div>
            <div className="relative">
              <img src="/appicon.png" alt="Kolia App" className="w-20 h-20 rounded-2xl mx-auto mb-6 shadow-lg" />
              <h2 className="font-[family-name:var(--font-display)] text-3xl sm:text-4xl font-bold text-white mb-4">
                Ready to Taste Africa?
              </h2>
              <p className="text-white/80 text-lg mb-8 max-w-md mx-auto">
                Download Kolia today and explore the best African restaurants in your city.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="#" className="inline-flex items-center justify-center gap-3 bg-black text-white px-8 py-4 rounded-xl hover:bg-black/80 transition-colors">
                  <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor"><path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/></svg>
                  <div className="text-left">
                    <div className="text-[10px] uppercase tracking-wider opacity-80">Download on the</div>
                    <div className="text-base font-semibold -mt-0.5">App Store</div>
                  </div>
                </a>
                <a href="#" className="inline-flex items-center justify-center gap-3 bg-black text-white px-8 py-4 rounded-xl hover:bg-black/80 transition-colors">
                  <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor"><path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 01-.61-.92V2.734a1 1 0 01.609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.199l2.302 2.302a1 1 0 010 1.38l-2.302 2.302L15.111 12l2.587-2.492zM5.864 2.658L16.8 9.49l-2.302 2.302-8.634-8.634z"/></svg>
                  <div className="text-left">
                    <div className="text-[10px] uppercase tracking-wider opacity-80">Get it on</div>
                    <div className="text-base font-semibold -mt-0.5">Google Play</div>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Partner CTA */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-surface">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-secondary rounded-2xl p-8 sm:p-10 text-white">
              <h3 className="font-[family-name:var(--font-display)] text-2xl font-bold mb-3">Own a restaurant?</h3>
              <p className="text-white/70 mb-6">Partner with Kolia and reach thousands of African food lovers in your city. Easy onboarding, real-time orders, and powerful analytics.</p>
              <a href="#" className="inline-block bg-white text-secondary px-6 py-3 rounded-full font-semibold text-sm hover:bg-white/90 transition-colors">
                Become a partner
              </a>
            </div>
            <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl p-8 sm:p-10 border border-primary/10">
              <h3 className="font-[family-name:var(--font-display)] text-2xl font-bold text-text-primary mb-3">Want to deliver?</h3>
              <p className="text-text-secondary mb-6">Join our delivery team and earn on your own schedule. Flexible hours, competitive pay, and a supportive community.</p>
              <a href="#" className="inline-block bg-primary text-white px-6 py-3 rounded-full font-semibold text-sm hover:bg-primary-dark transition-colors">
                Start delivering
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-text-primary text-white py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            <div>
              <img src="/logo.png" alt="Kolia" className="h-10 brightness-0 invert mb-4" />
              <p className="text-white/50 text-sm leading-relaxed">
                Bringing the authentic flavours of Africa to your doorstep across Europe.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-white/70">Company</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-white/50 hover:text-white text-sm transition-colors">About us</a></li>
                <li><a href="#" className="text-white/50 hover:text-white text-sm transition-colors">Careers</a></li>
                <li><a href="#" className="text-white/50 hover:text-white text-sm transition-colors">Blog</a></li>
                <li><a href="#" className="text-white/50 hover:text-white text-sm transition-colors">Press</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-white/70">Support</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-white/50 hover:text-white text-sm transition-colors">Help centre</a></li>
                <li><a href="#" className="text-white/50 hover:text-white text-sm transition-colors">Contact us</a></li>
                <li><a href="#" className="text-white/50 hover:text-white text-sm transition-colors">FAQ</a></li>
                <li><a href="#" className="text-white/50 hover:text-white text-sm transition-colors">Accessibility</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-white/70">Legal</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-white/50 hover:text-white text-sm transition-colors">Privacy policy</a></li>
                <li><a href="#" className="text-white/50 hover:text-white text-sm transition-colors">Terms of service</a></li>
                <li><a href="#" className="text-white/50 hover:text-white text-sm transition-colors">Cookie policy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-white/40 text-sm">&copy; {new Date().getFullYear()} Kolia. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <a href="#" className="text-white/40 hover:text-white transition-colors" aria-label="Instagram">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
              </a>
              <a href="#" className="text-white/40 hover:text-white transition-colors" aria-label="Twitter">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
              <a href="#" className="text-white/40 hover:text-white transition-colors" aria-label="Facebook">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
              <a href="#" className="text-white/40 hover:text-white transition-colors" aria-label="TikTok">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
