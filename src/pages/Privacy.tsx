const PrivacyPolicy = () => {
  return (
    <div className="container mx-auto px-4 py-20 max-w-3xl text-muted-foreground">
      <h1 className="text-4xl font-bold mb-6 text-foreground">Privacy Policy</h1>
      <p className="mb-4">
        At <strong>TikTrend AI</strong>, we respect your privacy and are committed to protecting your personal information.
        This Privacy Policy explains how we collect, use, and safeguard your data.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4 text-foreground">1. Information We Collect</h2>
      <p className="mb-4">
        We may collect your name, email address, and TikTok niche when you fill out our early access form.
        This information is used solely for communication, beta invitations, and updates about TikTrend AI.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4 text-foreground">2. How We Use Your Data</h2>
      <p className="mb-4">
        We use your data to:
      </p>
      <ul className="list-disc list-inside mb-4">
        <li>Send you information about product updates and beta access</li>
        <li>Improve our services and user experience</li>
        <li>Respond to your inquiries or feedback</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-8 mb-4 text-foreground">3. Data Protection</h2>
      <p className="mb-4">
        Your information is securely stored and never sold, shared, or rented to third parties.  
        We use Supabase to handle form submissions and email communication in a secure environment.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4 text-foreground">4. Cookies and Analytics</h2>
      <p className="mb-4">
        We may use Google Analytics or similar tools to understand website usage.  
        These tools may collect anonymous usage data to improve our service.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4 text-foreground">5. Contact</h2>
      <p className="mb-4">
        If you have any questions about this Privacy Policy, contact us at:  
        <a href="mailto:tiktrendai@gmail.com" className="text-primary hover:underline">tiktrendai@gmail.com</a>
      </p>

      <p className="text-sm mt-12">
        Last updated: November 2025
      </p>
    </div>
  );
};

export default PrivacyPolicy;
