import { ScreenHeader } from "@/components/orbit/ScreenHeader";

export const InfoScreen = ({ title, body }: { title: string; body: React.ReactNode }) => (
  <div className="min-h-screen pb-6">
    <ScreenHeader title={title} />
    <div className="px-5 mt-4 premium-card p-5 text-sm text-muted-foreground leading-relaxed space-y-3">
      {body}
    </div>
  </div>
);

export const Support = () => (
  <InfoScreen title="Support" body={
    <>
      <p className="text-foreground font-medium">We're here to help.</p>
      <p>Email <span className="text-primary">help@orbit.app</span> or browse our knowledge base for answers to common questions about capture, reminders, and your data.</p>
      <p>Average response time: under 24 hours.</p>
    </>
  } />
);

export const Privacy = () => (
  <InfoScreen title="Privacy Policy" body={
    <>
      <p className="text-foreground font-medium">Your data, your control.</p>
      <p>Orbit processes your captures locally where possible. Anything sent to our AI is encrypted in transit and never used to train external models.</p>
      <p>You can export or delete your data at any time from Settings.</p>
    </>
  } />
);

export const Terms = () => (
  <InfoScreen title="Terms of Service" body={
    <>
      <p className="text-foreground font-medium">Fair use, plain English.</p>
      <p>By using Orbit you agree to use it for lawful, personal productivity. We don't sell your data, ever.</p>
      <p>Subscriptions renew monthly and can be cancelled anytime.</p>
    </>
  } />
);
