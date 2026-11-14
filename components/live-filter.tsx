"use client"

import { useEffect } from "react"

export function LiveFilter() {
  useEffect(() => {
    function apply() {
      const params = new URLSearchParams(window.location.search)
      const industry = params.get("industry") || ""
      const location = params.get("location") || ""
      const travel = params.get("travel") === "1"
      let shown = 0
      document.querySelectorAll<HTMLElement>("[data-filter-item]").forEach((item) => {
        const industries = (item.dataset.industries || "").split(" ").filter(Boolean)
        const loc = item.dataset.location || ""
        const canTravel = item.dataset.travel === "1"
        const ok =
          (!industry || industries.includes(industry)) &&
          (!location || loc === location) &&
          (!travel || canTravel)
        item.hidden = !ok
        if (ok) shown += 1
      })
      const count = document.querySelector<HTMLElement>("[data-filter-count]")
      if (count && (industry || location || travel)) {
        count.dataset.filterShown = String(shown)
        count.textContent = `${shown} matching ${shown === 1 ? "result" : "results"} on this page.`
      }
    }
    apply()
    window.addEventListener("popstate", apply)
    return () => window.removeEventListener("popstate", apply)
  }, [])
  return null
}
