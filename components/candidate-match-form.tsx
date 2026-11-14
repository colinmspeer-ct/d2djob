import Script from "next/script"

export function CandidateMatchForm() {
  return (
    <section id="get-matched" className="grid gap-4">
      <h2 className="text-2xl">Get matched with a door-to-door sales job</h2>
      <p className="leading-relaxed">
        Tell the desk the trade you sell, the cities you can work, and how you want to be paid. The form below goes to
        the recruiting desk.
      </p>
      <div className="overflow-hidden rounded-lg bg-card ring-1 ring-foreground/10" style={{ height: 842 }}>
        <iframe
          src="https://api.leadconnectorhq.com/widget/form/g8xXrImbYSa3VNFJnbff"
          style={{ width: "100%", height: "100%", border: "none", borderRadius: "8px" }}
          id="inline-g8xXrImbYSa3VNFJnbff"
          data-layout="{'id':'INLINE'}"
          data-trigger-type="alwaysShow"
          data-trigger-value=""
          data-activation-type="alwaysActivated"
          data-activation-value=""
          data-deactivation-type="neverDeactivate"
          data-deactivation-value=""
          data-form-name="D2D Job Candidate Form"
          data-height="842"
          data-layout-iframe-id="inline-g8xXrImbYSa3VNFJnbff"
          data-form-id="g8xXrImbYSa3VNFJnbff"
          data-cookie-consent="true"
          data-cookie-consent-provider="auto"
          title="D2D Job Candidate Form"
        />
      </div>
      <Script src="https://link.msgsndr.com/js/form_embed.js" strategy="afterInteractive" />
    </section>
  )
}
