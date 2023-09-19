// const { By, Key, Builder } = require("selenium-webdriver");
import { By, Key, Builder, Capabilities, until } from "selenium-webdriver";
import { assert } from "chai";
import "@testing-library/jest-dom";

describe("Unverified dummy account log in, verification message pops up", () => {
  let driver = new Builder().forBrowser("firefox").build();

  afterAll(async () => {
    await driver.quit();
  }, 10000);

  test("Test email verification prompt", async () => {
    await driver.get("localhost:5173");

    await driver.findElement(By.name("login-btn")).click();
    await driver.findElement(By.id("email")).sendKeys("seanpzk3@gmail.com");
    await driver.findElement(By.id("password")).sendKeys("testacc", Key.RETURN);
    await driver.wait(until.elementLocated(By.className("verify-Form")), 5000);
    let text = await driver.findElement(By.className("verify-Form")).getText();

    expect(text).toContain("Verify");
  }, 10000);
});
