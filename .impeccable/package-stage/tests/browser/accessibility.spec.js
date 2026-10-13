import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("telas legíveis e sem rolagem horizontal em celular e computador", async ({
  page,
}) => {
  test.setTimeout(90000);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  for (const width of [375, 844, 1440]) {
    await page.setViewportSize({ width, height: width === 844 ? 390 : 900 });
    for (const view of [
      "home",
      "learn",
      "review",
      "paper",
      "jlpt",
      "settings",
    ]) {
      if (width <= 700 && view === "settings")
        await page.getByRole("button", { name: "Abrir preferências" }).click();
      else
        await page
          .locator(
            `${width <= 700 ? ".bottom-nav" : ".sidebar"} button[data-view="${view}"]`,
          )
          .click();
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
        `${width}: ${view}`,
      ).toBe(true);
      const result = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
        .analyze();
      expect
        .soft(
          result.violations.map((v) => ({
            id: v.id,
            nodes: v.nodes.map((n) => ({
              target: n.target,
              summary: n.failureSummary,
            })),
          })),
          `${width}: ${view}`,
        )
        .toEqual([]);
    }
  }
});

test("abas por teclado, erro persistente e importação acessível", async ({
  page,
}) => {
  await page.goto("/");
  await page.locator('.side-nav button[data-view="learn"]').click();
  await expect(page.locator("#learnTitle")).toBeFocused();
  const hiragana = page.getByRole("tab", { name: "Hiragana" });
  await hiragana.focus();
  await page.keyboard.press("ArrowRight");
  await expect(page.getByRole("tab", { name: "Katakana" })).toBeFocused();
  await expect(page.getByRole("tab", { name: "Katakana" })).toHaveAttribute(
    "aria-selected",
    "true",
  );
  await page.locator('.side-nav button[data-view="jlpt"]').click();
  await page.getByRole("button", { name: "Registrar", exact: true }).click();
  await expect(page.getByRole("spinbutton")).toBeFocused();
  await expect(page.getByRole("alert")).toContainText("entre 0 e 100");
  await page.locator(".settings-link").click();
  await expect(page.locator("#settingsTitle")).toBeFocused();
  await page.getByRole("button", { name: "Importar backup" }).focus();
  const chooser = page.waitForEvent("filechooser");
  await page.keyboard.press("Enter");
  await chooser;
});
