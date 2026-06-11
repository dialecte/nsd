---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: NSD Dialecte
  text: IEC 61850 NSD, fully typed.
  tagline: Query, mutate, and manage NSD files with a type-safe Document API — 151+ element types, zero guesswork.
  actions:
    - theme: brand
      text: Get Started →
      link: /guide/introduction/getting-started
    - theme: alt
      text: Why NSD Dialecte?
      link: /guide/introduction/what-is-nsd-dialecte

features:
  - icon: ⚡
    title: 151+ Element Types
    details: Every NSD element — from NS to ServiceNS — is fully typed. Attributes, children, and parent relationships are all compiler-checked.
  - icon: 📄
    title: Document / Query / Transaction
    details: Read with doc.query, write inside doc.transaction(). Changes are staged and committed atomically — no partial writes.
  - icon: 🧩
    title: IEC 61850 NSD
    details: First-class support for the IEC 61850 Network Substation Description format. Typed access to NSD and NSDo files.
---
