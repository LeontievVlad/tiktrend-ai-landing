import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Sparkles, TrendingUp, Zap, Mail } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";

// Frontend validation schema
const formSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
  email: z.string().trim().email("Invalid email address").max(255, "Email must be less than 255 characters"),
  niche: z.string().trim().min(1, "TikTok niche is required").max(200, "Niche must be less than 200 characters"),
  betaAccess: z.boolean(),
});

const Index = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    niche: "",
    betaAccess: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hookTopic, setHookTopic] = useState("");
  const [hooks, setHooks] = useState<string[]>([]);
  const [isGeneratingHooks, setIsGeneratingHooks] = useState(false);
  const [showHooks, setShowHooks] = useState(false);

  const generateHooks = async () => {
    if (!hookTopic.trim()) {
      toast.error("Please enter a topic");
      return;
    }

    setIsGeneratingHooks(true);
    setShowHooks(false);

    try {
      const response = await fetch("https://hookgeneratorapi-production.up.railway.app/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Topic: hookTopic,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate hooks");
      }

      const data = await response.json();
      
      if (data.hooks && Array.isArray(data.hooks)) {
        setHooks(data.hooks);
        setShowHooks(true);
        toast.success("✅ Hooks generated!");
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error) {
      console.error("Error generating hooks:", error);
      toast.error("Failed to generate hooks. Please try again.");
    } finally {
      setIsGeneratingHooks(false);
    }
  };

  const copyHooks = () => {
    const hooksText = hooks.join("\n\n");
    navigator.clipboard.writeText(hooksText);
    toast.success("✅ Hooks copied to clipboard!");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form data with zod
    const validationResult = formSchema.safeParse(formData);

    if (!validationResult.success) {
      const firstError = validationResult.error.errors[0];
      toast.error(firstError.message);
      return;
    }

    setIsSubmitting(true);

    try {
      // Call the edge function
      const { data, error } = await supabase.functions.invoke('send-early-access', {
        body: {
          name: formData.name,
          email: formData.email,
          niche: formData.niche,
          betaAccess: formData.betaAccess,
        },
      });

      if (error) throw error;

      // Show success message
      toast.success("✅ Thank you! We'll be in touch soon.");
      
      // Reset form
      setFormData({
        name: "",
        email: "",
        niche: "",
        betaAccess: false,
      });
    } catch (error: any) {
      console.error("Error submitting form:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      {/* Header */}
      <header className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              TikTrend AI
            </span>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
            Get Trends and Ideas for Your{" "}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              TikTok
            </span>
            {" "}Channel
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
            Leverage AI to analyze trends, generate hashtags, and create captions for your videos
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <Button
              variant="hero"
              size="lg"
              onClick={() => document.getElementById("early-access")?.scrollIntoView({ behavior: "smooth" })}
            >
              Get Early Access
            </Button>
            <Button variant="outline" size="lg" onClick={() => document.getElementById("about")?.scrollIntoView({ behavior: "smooth" })}>
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Hook Generator Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-3xl mx-auto">
          <div className="bg-card rounded-3xl p-8 md:p-12 shadow-elegant border">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center">TikTok Hook Generator</h2>
            <div className="space-y-4">
              <Input
                id="topic"
                type="text"
                placeholder="Enter video topic..."
                value={hookTopic}
                onChange={(e) => setHookTopic(e.target.value)}
                className="text-lg"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !isGeneratingHooks) {
                    generateHooks();
                  }
                }}
              />
              <Button
                variant="hero"
                size="lg"
                onClick={generateHooks}
                disabled={isGeneratingHooks}
                className="w-full"
              >
                {isGeneratingHooks ? "Generating..." : "Generate 20 hooks"}
              </Button>
              
              {showHooks && hooks.length > 0 && (
                <>
                  <div className="mt-6 space-y-3 max-h-96 overflow-y-auto bg-muted/30 rounded-xl p-6">
                    {hooks.map((hook, index) => (
                      <div key={index} className="p-3 bg-background rounded-lg border">
                        <p className="text-sm">{hook}</p>
                      </div>
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={copyHooks}
                    className="w-full"
                  >
                    Copy all
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="container mx-auto px-4 py-20">
        <div className="max-w-5xl mx-auto">
          <div className="bg-card rounded-3xl p-8 md:p-12 shadow-elegant border">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">About the Product</h2>
            <div className="space-y-6 text-lg text-muted-foreground">
              <p>
                <span className="font-semibold text-foreground">TikTrend AI</span> is your personal assistant for creating viral content. 
                Our AI analyzes your niche, finds relevant trends, and helps you create content that engages your audience.
              </p>
              <div className="grid md:grid-cols-2 gap-6 pt-4">
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-primary" />
                    What We Do
                  </h3>
                  <ul className="space-y-2 text-base">
                    <li>• Analyze your TikTok niche</li>
                    <li>• Find relevant trends</li>
                    <li>• Generate hashtags and captions</li>
                    <li>• Provide ideas for new content</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
                    <Zap className="w-5 h-5 text-secondary" />
                    Your Value
                  </h3>
                  <ul className="space-y-2 text-base">
                    <li>• Save hours on research</li>
                    <li>• Grow faster than competitors</li>
                    <li>• Always stay on trend</li>
                    <li>• More time for creativity</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Early Access Form */}
      <section id="early-access" className="container mx-auto px-4 py-20">
        <div className="max-w-2xl mx-auto">
          <div className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-3xl p-8 md:p-12 border-2 border-primary/20">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">
              Get Early Access
            </h2>
            <p className="text-muted-foreground text-center mb-8">
              Leave your contact details, and we'll notify you first when we launch
            </p>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="niche">TikTok Niche</Label>
                <Input
                  id="niche"
                  placeholder="For example: beauty, fitness, education..."
                  value={formData.niche}
                  onChange={(e) => setFormData({ ...formData, niche: e.target.value })}
                  required
                />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="beta"
                  checked={formData.betaAccess}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, betaAccess: checked as boolean })
                  }
                />
                <Label
                  htmlFor="beta"
                  className="text-sm font-normal cursor-pointer"
                >
                  I want beta access and early updates
                </Label>
              </div>
              <Button 
                variant="hero" 
                size="lg" 
                type="submit" 
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Join the Waitlist"}
              </Button>
            </form>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Why Try It?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-card rounded-2xl p-8 shadow-lg border hover:shadow-elegant transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Personalized trend suggestions tailored to your niche</h3>
              <p className="text-muted-foreground">
                AI analyzes your specific niche and finds trends that suit you, not everyone else
              </p>
            </div>
            <div className="bg-card rounded-2xl p-8 shadow-lg border hover:shadow-elegant transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-xl font-semibold mb-3">AI generates hashtags and captions for your videos</h3>
              <p className="text-muted-foreground">
                Forget about writer's block. AI creates ready-made ideas and captions for your videos
              </p>
            </div>
            <div className="bg-card rounded-2xl p-8 shadow-lg border hover:shadow-elegant transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-secondary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Easy start, even for beginners</h3>
              <p className="text-muted-foreground">
                Intuitive interface and ready recommendations. No need to be an expert
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-12 border-t">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  TikTrend AI
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                AI assistant for creating viral TikTok content
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <a href="mailto:tiktrendai@gmail.com" className="flex items-center gap-2 hover:text-primary transition-colors">
                  <Mail className="w-4 h-4" />
                  tiktrendai@gmail.com
                </a>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Social Media</h4>
              <div className="flex gap-4">
                <a
                  href="https://tiktok.com/@tiktrendaiapp"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
                  aria-label="TikTok"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
          <div className="pt-8 border-t text-center text-sm text-muted-foreground">
            <p>© 2025 TikTrend AI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
