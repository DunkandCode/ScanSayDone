import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'best-practice'] as const;

test('landing page has no critical or serious a11y violations', async ({ page }) => {
  await page.goto('/');
  await page.waitForLoadState('networkidle');

  const results = await new AxeBuilder({ page })
    .withTags([...TAGS])
    .analyze();

  const { violations } = results;

  // Summary by impact
  const summary: Record<string, number> = {};
  for (const v of violations) {
    const impact = v.impact ?? 'unknown';
    summary[impact] = (summary[impact] ?? 0) + 1;
  }

  // eslint-disable-next-line no-console
  console.log('[axe summary]', JSON.stringify(summary, null, 2));

  // Detail critical + serious
  const criticalSerious = violations.filter(
    (v) => v.impact === 'critical' || v.impact === 'serious',
  );

  if (criticalSerious.length > 0) {
    // eslint-disable-next-line no-console
    console.log(
      '[axe critical/serious]',
      JSON.stringify(
        criticalSerious.map((v) => ({
          id: v.id,
          impact: v.impact,
          description: v.description,
          help: v.help,
          targets: v.nodes.map((n) => ({
            target: n.target,
            html: n.html.slice(0, 120),
            failureSummary: n.failureSummary,
          })),
        })),
        null,
        2,
      ),
    );
  }

  expect(criticalSerious).toEqual([]);
});
