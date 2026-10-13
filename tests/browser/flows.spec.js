import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { initialState } from "../../src/state.js";
const navigate = (page, view) =>
  page.locator(`[data-view="${view}"]:visible`).first().click();

test("todas as áreas acessíveis em desktop e celular, sem overflow", async ({
  page,
}) => {
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  for (const [width, height] of [
    [1440, 1000],
    [390, 844],
  ]) {
    await page.setViewportSize({ width, height });
    for (const view of [
      "home",
      "learn",
      "review",
      "jlpt",
      "paper",
      "settings",
    ]) {
      await navigate(page, view);
      await expect(page.locator(`#${view}Title`)).toBeVisible();
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
      expect(
        (
          await new AxeBuilder({ page })
            .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
            .analyze()
        ).violations,
      ).toEqual([]);
    }
  }
  expect(errors).toEqual([]);
});

test("filtro mantém tela, persiste nível e início abre lição correspondente", async ({
  page,
}) => {
  await page.goto("/");
  await page
    .getByRole("combobox", { name: "Filtrar por nível JLPT" })
    .selectOption("N4");
  await expect(page.locator("#homeTitle")).toBeVisible();
  await page.getByRole("button", { name: "Continuar N4" }).click();
  await expect(page.locator("#jlptTitle")).toBeVisible();
  await expect(
    page.getByRole("button", { name: /Está chovendo agora/ }),
  ).toBeVisible();
  await page.reload();
  await expect(
    page.getByRole("combobox", { name: "Filtrar por nível JLPT" }),
  ).toHaveValue("N4");
  await navigate(page, "jlpt");
  const tab = page.getByRole("tab", { name: /N4/ });
  await tab.focus();
  await page.keyboard.press("ArrowRight");
  await expect(page.getByRole("tab", { name: /N3/ })).toHaveAttribute(
    "aria-selected",
    "true",
  );
});

test("Katakana, teclado e revisão persistem resposta", async ({ page }) => {
  await page.goto("/");
  await navigate(page, "learn");
  await page.getByRole("tab", { name: /Hiragana/ }).focus();
  await page.keyboard.press("ArrowRight");
  await expect(page.getByRole("tab", { name: /Katakana/ })).toHaveAttribute(
    "aria-selected",
    "true",
  );
  await page.getByRole("button", { name: /Estudar 5 novos/ }).click();
  await page.getByRole("button", { name: "Revelar resposta" }).click();
  await page.getByRole("button", { name: /Bom Intervalo normal/ }).click();
  expect(
    await page.evaluate(
      () => JSON.parse(localStorage.getItem("kotonoha.v1")).stats.reviews,
    ),
  ).toBe(1);
});

test("sessão N5 registra revisão, tem foco contido e fecha com Escape", async ({
  page,
}) => {
  const state = initialState();
  state.cards["hira:あ"].seen = true;
  state.cards["hira:あ"].due = 0;
  await page.addInitScript(
    (s) => localStorage.setItem("kotonoha.v1", JSON.stringify(s)),
    state,
  );
  await page.goto("/");
  await page.getByRole("button", { name: /Estudar agora/ }).click();
  const dialog = page.getByRole("dialog", { name: "Sessão guiada N5" });
  await expect(dialog).toBeVisible();
  await page.getByRole("button", { name: "Mostrar resposta" }).click();
  await page.getByRole("button", { name: "Lembrei", exact: true }).click();
  expect(
    await page.evaluate(
      () =>
        JSON.parse(localStorage.getItem("kotonoha.v1")).cards["hira:あ"].reps,
    ),
  ).toBe(1);
  await page.keyboard.press("Escape");
  await expect(dialog).toHaveCount(0);
  await expect(
    page.getByRole("button", { name: /Estudar agora/ }),
  ).toBeFocused();
});

test("notas editáveis persistem e backup é exportado", async ({ page }) => {
  await page.goto("/");
  await navigate(page, "paper");
  await page.getByRole("button", { name: /Páginas & Notas/ }).click();
  await page.getByRole("button", { name: /Nova Nota/ }).click();
  await page
    .getByRole("textbox", { name: "Título da nota" })
    .fill("Meu plano de japonês");
  await page.reload();
  await navigate(page, "paper");
  await page.getByRole("button", { name: /Páginas & Notas/ }).click();
  await expect(
    page.getByRole("heading", { name: "Meu plano de japonês" }),
  ).toBeVisible();
  await navigate(page, "settings");
  const download = page.waitForEvent("download");
  await page.getByRole("button", { name: "Exportar backup JSON" }).click();
  expect((await download).suggestedFilename()).toContain("kotonoha-backup");
});

test("mobile tem cinco destinos, preferências por ícone e conversa na biblioteca", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await expect(
    page
      .getByRole("navigation", { name: "Navegação móvel" })
      .getByRole("button"),
  ).toHaveCount(5);
  await page.getByRole("button", { name: "Abrir preferências" }).click();
  await expect(page.locator("#settingsTitle")).toBeVisible();
  await navigate(page, "learn");
  await page.getByRole("tab", { name: "Conversar", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Cenários do Dia a Dia (Offline)" }),
  ).toBeVisible();
});

test("PWA continua acessível sem rede após preparar cache", async ({
  page,
  context,
}) => {
  await page.goto("/");
  await page.evaluate(() => navigator.serviceWorker.ready);
  await page.reload();
  await page.waitForFunction(() => navigator.serviceWorker.controller);
  await context.setOffline(true);
  await page.reload();
  await expect(page.locator("#homeTitle")).toBeVisible();
  await navigate(page, "learn");
  await expect(page.getByRole("tab", { name: /Hiragana/ })).toBeVisible();
});
