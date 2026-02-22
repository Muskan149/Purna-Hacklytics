import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-illustration.jpg";
import { Button } from "@/components/ui/button";
import {
  Wallet,
  Users,
  ShoppingCart,
  Heart,
  ShieldCheck,
  ArrowRight,
  Leaf,
  MapPin,
} from "lucide-react";
import PurnaLogo from "@/components/PurnaLogo";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.5, ease: "easeOut" as const },
  }),
};

const steps = [
  {
    icon: Users,
    title: "Tell us about your household",
    desc: "Budget, family size, and any dietary or health needs.",
  },
  {
    icon: Leaf,
    title: "Get a smart weekly plan",
    desc: "Recipes that reuse ingredients that can be found at your local corner store too!",
  },
  {
    icon: MapPin,
    title: "Shop at SNAP-friendly stores",
    desc: "Find nearby stores that carry what you need and accept SNAP.",
  },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-hero opacity-[0.04]" />
        <div className="container relative py-20 md:py-32">
          <motion.div
            className="mx-auto max-w-2xl text-center"
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={0}
          >
            <div className="mb-6 flex justify-center">
              <PurnaLogo size={56} showText={false} />
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-foreground md:text-5xl lg:text-6xl">
              Let's make Healthy convenient 
            </h1>
            <p className="mx-auto mt-5 max-w-lg text-lg text-muted-foreground">
              Purna builds a weekly meal plan around your budget, reuses ingredients to cut costs, and finds SNAP-supporting stores near you.
            </p>
            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Link to="/plan">
                <Button size="lg" className="rounded-xl gap-2 px-8 text-base">
                  Build my weekly meal plan
                  <ArrowRight size={18} />
                </Button>
              </Link>
              <a href="#how-it-works">
                <Button size="lg" variant="outline" className="rounded-xl px-8 text-base">
                  See how it works
                </Button>
              </a>
            </div>
          </motion.div>

          {/* Hero mock card */}
          <motion.div
            className="mx-auto mt-14 max-w-md"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.6 }}
          >
            <div className="rounded-2xl border border-border bg-card p-6 shadow-elevated">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-sm font-semibold text-foreground">Weekly Plan Preview</span>
                <span className="rounded-lg bg-muted px-2 py-0.5 text-xs font-medium text-primary">7 dinners</span>
              </div>
              <div className="space-y-2">
                {["Mon: Rice & Bean Bowl", "Tue: Baked Chicken", "Wed: Lentil Soup"].map((d) => (
                  <div key={d} className="flex items-center gap-2 rounded-xl bg-muted/60 px-3 py-2 text-sm text-foreground">
                    <Leaf size={14} className="text-primary" />
                    {d}
                  </div>
                ))}
                <div className="text-center text-xs text-muted-foreground">+ 4 more days…</div>
              </div>
              <div className="mt-4 flex items-center justify-between rounded-xl bg-primary/10 px-3 py-2">
                <span className="text-xs font-medium text-foreground">Est. total: $38.60</span>
                <span className="flex items-center gap-1 text-xs font-semibold text-primary">
                  <ShieldCheck size={14} /> SNAP Stores Found
                </span>
              </div>
            </div>
          </motion.div>

          {/* Hero illustration */}
          <motion.div
            className="mx-auto mt-10 max-w-3xl overflow-hidden rounded-2xl shadow-elevated"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <img src={heroImage} alt="Families planning healthy meals together" className="w-full object-cover" />
          </motion.div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="border-t border-border bg-card py-20">
        <div className="container">
          <motion.h2
            className="mb-12 text-center text-3xl font-bold text-foreground"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            How Purna works
          </motion.h2>
          <div className="mx-auto grid max-w-3xl gap-8 md:grid-cols-3">
            {steps.map((s, i) => (
              <motion.div
                key={s.title}
                className="flex flex-col items-center text-center"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
                variants={fadeUp}
              >
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
                  <s.icon className="text-primary" size={26} />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-foreground">{s.title}</h3>
                <p className="text-sm text-muted-foreground">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust strip
      <section className="border-t border-border py-16">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <div className="mb-6 flex justify-center gap-6">
              {[
                { icon: Heart, label: "No judgment" },
                { icon: ShieldCheck, label: "Private & safe" },
                { icon: Wallet, label: "Budget-first" },
                { icon: ShoppingCart, label: "SNAP-friendly" },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex flex-col items-center gap-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted">
                    <Icon size={20} className="text-primary" />
                  </div>
                  <span className="text-xs font-medium text-muted-foreground">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section> */}

      {/* Footer */}
      <footer className="border-t border-border bg-card py-10">
        <div className="container">
          <div className="flex flex-col items-center gap-4 md:flex-row md:justify-between">
            <PurnaLogo size={28} />
            <p className="text-xs text-muted-foreground">
              Purna is not medical advice. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
