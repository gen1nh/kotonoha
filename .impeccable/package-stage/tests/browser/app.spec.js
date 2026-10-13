import { test, expect } from "@playwright/test";

test("aprendizado, revisão, desenho, preferências e persistência", async ({
  page,
}) => {
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/");
  await expect(page.locator("#homeTitle")).toContainText("Uma pergunta");
  await page.locator('.side-nav [data-view="learn"]').click();
  await page.getByRole("tab", { name: "Katakana" }).click();
  await expect(page.locator(".kana-cell")).toHaveCount(46);
  await page.getByRole("button", { name: "Estudar 5 novos" }).click();
  await expect(page.locator(".review-category")).toHaveText("KATAKANA");
  await expect(page.locator(".rate-btn")).toHaveCount(0);
  await page.getByRole("button", { name: "Revelar resposta" }).click();
  await page.getByRole("button", { name: "Bom Intervalo normal" }).click();
  await expect(page.locator(".review-summary")).toContainText("Cartão 2 de 5");
  await page.locator('.side-nav [data-view="learn"]').click();
  await page.getByRole("button", { name: "Pratiquei", exact: true }).click();
  await page.getByRole("tab", { name: "Gramática" }).click();
  await page.getByRole("button", { name: "Praticar", exact: true }).click();
  await page.getByRole("button", { name: "は — apresentar o tópico" }).click();
  await expect(page.locator(".quiz-choice.correct")).toHaveCount(1);
  await page.locator('.side-nav [data-view="paper"]').click();
  await page.getByRole("checkbox").check();
  await page.locator('.side-nav [data-view="jlpt"]').click();
  await page.locator(".jlpt-card").filter({ hasText: "N3" }).click();
  await expect(page.locator(".lesson-list-item")).toHaveCount(3);
  await page.getByRole("spinbutton").fill("75");
  await page.getByRole("button", { name: "Registrar", exact: true }).click();
  await expect(page.locator(".vocab-row")).toContainText("75%");
  await page.reload();
  await expect(page.locator(".level-pill")).toContainText("N3");
  await expect(page.locator("#streakCount")).toHaveText("1");
  await page.locator(".settings-link").click();
  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "Exportar backup" }).click();
  expect((await downloadPromise).suggestedFilename()).toMatch(
    /kotonoha-backup/,
  );
  expect(errors).toEqual([]);
});

test("N4 question-first lesson explains each answer and saves completion", async ({
  page,
}) => {
  await page.goto("/");
  await page.locator('.side-nav [data-view="jlpt"]').click();
  await page.locator(".jlpt-card").filter({ hasText: "N4" }).click();
  await page.getByRole("button", { name: "Começar" }).first().click();

  const answers = [
    "Está chovendo agora.",
    "O estado atual de morar em Tóquio.",
    "Ainda",
    "待っています",
  ];
  for (let index = 0; index < answers.length; index += 1) {
    await page
      .getByRole("button", { name: new RegExp(answers[index]) })
      .click();
    await expect(page.locator(".lesson-answer-feedback")).toContainText(
      "Isso mesmo.",
    );
    await page
      .getByRole("button", {
        name:
          index === answers.length - 1 ? "Concluir lição" : "Próxima questão",
      })
      .click();
  }
  await expect(page.locator(".lesson-finished")).toContainText(
    "Revisão concluída.",
  );
  await page.getByRole("button", { name: /Voltar às lições/ }).click();
  await expect(page.locator(".lesson-list-heading")).toContainText(
    "1 / 3 concluídas",
  );
  await page.reload();
  await page.locator('.side-nav [data-view="jlpt"]').click();
  await expect(page.locator(".lesson-list-heading")).toContainText(
    "1 / 3 concluídas",
  );
});

test("navegação móvel e app offline após primeiro acesso", async ({
  page,
  context,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.evaluate(() => navigator.serviceWorker.ready.then(() => true));
  await page.reload();
  await context.setOffline(true);
  await page.reload();
  await expect(page.locator("#homeTitle")).toBeVisible();
  await page.locator('.bottom-nav [data-view="learn"]').click();
  await expect(page.locator(".kana-cell")).toHaveCount(46);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
});
