import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Sparkles, TrendingUp, Zap, Mail, Instagram, Linkedin } from "lucide-react";
import { toast } from "sonner";

const Index = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    niche: "",
    betaAccess: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name || !formData.email || !formData.niche) {
      toast.error("Будь ласка, заповніть всі поля");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      toast.error("Введіть коректний email");
      return;
    }

    // Show success message
    toast.success("Дякуємо! Ми зв'яжемося з вами найближчим часом 🎉");
    
    // Reset form
    setFormData({
      name: "",
      email: "",
      niche: "",
      betaAccess: false,
    });
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
            Отримуй тренди і ідеї для{" "}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              TikTok
            </span>
            {" "}каналу
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
            Використовуй силу AI для аналізу трендів, генерації хештегів та текстів під відео
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <Button
              variant="hero"
              size="lg"
              onClick={() => document.getElementById("early-access")?.scrollIntoView({ behavior: "smooth" })}
            >
              Отримати ранній доступ
            </Button>
            <Button variant="outline" size="lg">
              Дізнатися більше
            </Button>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-5xl mx-auto">
          <div className="bg-card rounded-3xl p-8 md:p-12 shadow-elegant border">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Про продукт</h2>
            <div className="space-y-6 text-lg text-muted-foreground">
              <p>
                <span className="font-semibold text-foreground">TikTrend AI</span> — твій особистий асистент для створення вірусного контенту. 
                Наш AI аналізує твою нішу, знаходить актуальні тренди та допомагає створювати контент, який зацікавить аудиторію.
              </p>
              <div className="grid md:grid-cols-2 gap-6 pt-4">
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-primary" />
                    Що ми робимо
                  </h3>
                  <ul className="space-y-2 text-base">
                    <li>• Аналіз твоєї ніші в TikTok</li>
                    <li>• Підбір актуальних трендів</li>
                    <li>• Генерація хештегів та текстів</li>
                    <li>• Ідеї для нового контенту</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
                    <Zap className="w-5 h-5 text-secondary" />
                    Твоя цінність
                  </h3>
                  <ul className="space-y-2 text-base">
                    <li>• Економиш години на дослідження</li>
                    <li>• Зростаєш швидше за конкурентів</li>
                    <li>• Завжди в тренді</li>
                    <li>• Більше часу на творчість</li>
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
              Отримай ранній доступ
            </h2>
            <p className="text-muted-foreground text-center mb-8">
              Залиш контакти, і ми повідомимо тебе першим про запуск
            </p>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Ім'я</Label>
                <Input
                  id="name"
                  placeholder="Введи своє ім'я"
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
                  placeholder="твій@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="niche">TikTok ніша</Label>
                <Input
                  id="niche"
                  placeholder="Наприклад: красота, фітнес, освіта..."
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
                  Хочу бета-доступ та ранні оновлення
                </Label>
              </div>
              <Button variant="hero" size="lg" type="submit" className="w-full">
                Приєднатися до списку очікування
              </Button>
            </form>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Чому варто спробувати?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-card rounded-2xl p-8 shadow-lg border hover:shadow-elegant transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Персоналізовані тренди</h3>
              <p className="text-muted-foreground">
                AI аналізує саме твою нішу і знаходить тренди, які підходять тобі, а не всім підряд
              </p>
            </div>
            <div className="bg-card rounded-2xl p-8 shadow-lg border hover:shadow-elegant transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-secondary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">AI пропонує ідеї та тексти</h3>
              <p className="text-muted-foreground">
                Забудь про writer's block. AI створює готові ідеї та підписи для твоїх відео
              </p>
            </div>
            <div className="bg-card rounded-2xl p-8 shadow-lg border hover:shadow-elegant transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Легкий старт навіть для новачків</h3>
              <p className="text-muted-foreground">
                Інтуїтивний інтерфейс та готові рекомендації. Не потрібно бути експертом
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
                AI-помічник для створення вірусного TikTok контенту
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Контакти</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <a href="mailto:info@tiktrend.ai" className="flex items-center gap-2 hover:text-primary transition-colors">
                  <Mail className="w-4 h-4" />
                  info@tiktrend.ai
                </a>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Соцмережі</h4>
              <div className="flex gap-4">
                <a
                  href="#"
                  className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
          <div className="pt-8 border-t text-center text-sm text-muted-foreground">
            <p>© 2025 TikTrend AI. Всі права захищені.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
