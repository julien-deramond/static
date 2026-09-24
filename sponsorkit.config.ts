import { BadgePreset, defineConfig, partitionTiers, tierPresets } from 'sponsorkit'

// The images are shown on other sites and on both GitHub themes, so they carry their own dark background. Web fonts
// can't load in an SVG shown with <img>, so the text falls back to system fonts.
const FIELD = '#0A0C11'
const LINE = '#292C33'
const TEXT = '#E6E8EC'
const MUTED = '#8F929A'
const CYAN = '#3AB9BF'
const BRACKET = 16
const INSET = 10

const past: BadgePreset = {
  avatar: {
    size: 20,
  },
  boxWidth: 22,
  boxHeight: 22,
  container: {
    sidePadding: 35,
  },
}

export default defineConfig({
  svgInlineCSS: `
text {
  font-family: 'Roboto Mono', ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  font-size: 12px;
  fill: ${MUTED};
}
.sponsorkit-link {
  cursor: pointer;
}
.sponsorkit-tier-title {
  font-size: 13px;
  letter-spacing: 2.6px;
}
.sponsorkit-url {
  font-size: 11px;
  fill: ${CYAN};
}
.sponsorkit-name {
  fill: ${TEXT};
}
`,
  // The default tier layout, then the frame drawn under it once the height is known: the dark background, a 1px border
  // and cyan corner brackets on two opposite corners. An image with no sponsor stays empty, as before.
  async customComposer(composer, sponsors, config) {
    composer.addSpan(config.padding?.top ?? 20)
    let empty = true
    for (const { tier, sponsors: tierSponsors } of partitionTiers(sponsors, config.tiers!, config.includePastSponsors)) {
      const preset = tier.preset || tierPresets.base
      if (!tierSponsors.length || !preset.avatar.size)
        continue
      empty = false
      composer.addSpan(tier.padding?.top ?? 20)
      if (tier.title)
        composer.addTitle(tier.title.toUpperCase()).addSpan(5)
      await composer.addSponsorGrid(tierSponsors, preset)
      composer.addSpan(tier.padding?.bottom ?? 10)
    }
    if (empty) {
      composer.addSpan(config.padding?.bottom ?? 20)
      return
    }
    composer.addSpan(14).addText('github.com/sponsors/julien-deramond', 'sponsorkit-url')
    composer.addSpan(config.padding?.bottom ?? 20)

    const w = config.width!
    const h = composer.height
    const x = INSET
    const y = INSET
    const r = w - INSET
    const b = h - INSET
    composer.body = `<rect width="${w}" height="${h}" fill="${FIELD}"/>`
      + `<rect x="0.5" y="0.5" width="${w - 1}" height="${h - 1}" fill="none" stroke="${LINE}"/>`
      + `<path d="M${x},${y + BRACKET} V${y} H${x + BRACKET} M${r - BRACKET},${b} H${r} V${b - BRACKET}" fill="none" stroke="${CYAN}" stroke-width="1.5" stroke-linecap="square"/>`
      + composer.body
  },
  tiers: [
    {
      title: 'Past Sponsors',
      monthlyDollars: -1,
      preset: past,
    },
    {
      title: 'Backers',
      preset: tierPresets.small,
    },
    {
      title: 'Sponsors',
      monthlyDollars: 10,
      preset: {
        avatar: {
          size: 42,
        },
        boxWidth: 52,
        boxHeight: 52,
        container: {
          sidePadding: 30,
        },
      }
    },
    {
      title: 'Silver Sponsors',
      monthlyDollars: 50,
      preset: tierPresets.medium,
    },
    {
      title: 'Gold Sponsors',
      monthlyDollars: 100,
      preset: tierPresets.large,
    },
    {
      title: 'Platinum Sponsors',
      monthlyDollars: 500,
      preset: tierPresets.xl,
    },
    {
      title: 'Special Sponsor',
      monthlyDollars: Infinity,
    },
  ]
})
