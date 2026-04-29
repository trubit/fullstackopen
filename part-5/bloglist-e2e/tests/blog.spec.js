// NOTE: Import Playwright test helpers:
// `test` defines test cases, `expect` is for assertions.
const { expect, describe, beforeEach, test } = require("@playwright/test");

// NOTE: Small helper to pause execution for a short time between retries.
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// NOTE: Backend helper:
// Try POST request multiple times, because local backend can be temporarily unstable.
async function postWithRetry(request, url, options = {}, attempts = 4) {
  let lastError;

  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      // NOTE: Attempt the API call.
      const response = await request.post(url, options);
      // NOTE: Success path.
      if (response.ok()) return response;
      // NOTE: Save non-2xx status as error so we can retry/fail with context.
      lastError = new Error(`POST ${url} failed with status ${response.status()}`);
    } catch (error) {
      // NOTE: Save network/runtime error and retry.
      lastError = error;
    }

    if (attempt < attempts) {
      // NOTE: Linear backoff gives backend time to recover.
      await sleep(400 * attempt);
    }
  }

  // NOTE: If all attempts fail, surface the last error.
  throw lastError;
}

// NOTE: Best-effort database reset:
// some projects expose `/api/testing/reset`, others `/testing/reset`.
// If neither exists, tests continue with unique test data.
async function resetDatabaseIfSupported(request) {
  const resetUrls = [
    "http://localhost:3003/api/testing/reset",
    "http://localhost:3003/testing/reset",
  ];

  for (const url of resetUrls) {
    try {
      const response = await request.post(url);
      if (response.ok()) return true;
      if (response.status() === 404) continue;
    } catch (_error) {
      // NOTE: Ignore this endpoint failure and try next known reset path.
    }
  }

  // NOTE: Reset endpoint not available in this environment.
  return false;
}

// NOTE: Frontend navigation helper with retries.
async function gotoWithRetry(page, url, attempts = 3) {
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      await page.goto(url, { waitUntil: "domcontentloaded" });
      return;
    } catch (error) {
      if (attempt === attempts) throw error;
      await page.waitForTimeout(1000);
    }
  }
}

describe("Blog App", () => {
  // NOTE: Run tests in this file serially to reduce data races in shared backend.
  test.describe.configure({ mode: "serial" });

  let testUser;

  beforeEach(async ({ page, request }, testInfo) => {
    // NOTE: Start from a known backend state when reset route exists.
    await resetDatabaseIfSupported(request);

    // NOTE: Create unique credentials per test to avoid username collisions.
    testUser = {
      username: `TrusonHub-${testInfo.project.name}-${Date.now()}`,
      name: "Truson",
      password: "TRuson222",
    };

    // NOTE: Seed the test user directly through backend API.
    const createUserResponse = await postWithRetry(
      request,
      "http://localhost:3003/api/users",
      {
        data: testUser,
      },
    );
    expect(createUserResponse.ok()).toBeTruthy();

    // NOTE: Open frontend only after backend setup is complete.
    await gotoWithRetry(page, "http://localhost:5173");
  });

  // NOTE: Basic smoke test: login form should be visible to anonymous user.
  test("login Form is visible", async ({ page }) => {
    // NOTE: Verify both input labels and login action button are shown.
    await expect(page.getByText("username")).toBeVisible();
    await expect(page.getByText("password")).toBeVisible();
    await expect(page.getByRole("button", { name: "login" })).toBeVisible();
  });

  describe("Login", () => {
    // NOTE: Happy path login test.
    test("succeeds with correct credentials", async ({ page }) => {
      // NOTE: Enter valid credentials created in global beforeEach.
      await page.getByLabel("username").fill(testUser.username);
      await page.getByLabel("password").fill(testUser.password);
      await page.getByRole("button", { name: "login" }).click();

      // NOTE: Logged-in state is confirmed by visible logout button.
      await expect(page.getByRole("button", { name: /logout/i })).toBeVisible();
    });

    // NOTE: Negative login test with wrong password.
    test("fails with wrong credentials", async ({ page }) => {
      // NOTE: Keep username valid, password invalid.
      await page.getByLabel("username").fill(testUser.username);
      await page.getByLabel("password").fill("wrongpassword");
      await page.getByRole("button", { name: "login" }).click();

      // NOTE: On failed login, login button remains and logout does not appear.
      await expect(page.getByRole("button", { name: "login" })).toBeVisible();
      await expect(page.getByRole("button", { name: /logout/i })).toHaveCount(
        0,
      );
    });
  });

  // NOTE: All tests in this block assume authenticated session.
  describe("When logged in", () => {
    beforeEach(async ({ page }) => {
      // NOTE: Log in once per test in this block.
      await expect(page.getByLabel("username")).toBeVisible();
      await page.getByLabel("username").fill(testUser.username);
      await page.getByLabel("password").fill(testUser.password);
      await page.getByRole("button", { name: "login" }).click();
      await expect(page.getByRole("button", { name: /logout/i })).toBeVisible();
    });

    // NOTE: Verify a logged-in user can create a blog.
    test("a blog can be created", async ({ page }) => {
      // NOTE: Unique title lets us target this exact blog later.
      const blogTitle = `Test Blog Title ${test.info().project.name}-${Date.now()}`;

      // NOTE: Open blog creation form.
      await page.getByRole("button", { name: "new blog" }).click();

      // NOTE: Fill all required fields.
      await page.getByLabel("title").fill(blogTitle);
      await page.getByLabel("author").fill("Test Author");
      await page.getByLabel("url").fill("http://testblog.com");

      // NOTE: Submit form.
      await page.getByRole("button", { name: "create" }).click();

      // NOTE: Assert created blog appears in list.
      await expect(page.getByText(blogTitle, { exact: true })).toBeVisible();
    });

    // NOTE: Verify like functionality updates likes count.
    test("a blog can be liked", async ({ page }) => {
      const blogTitle = `Likeable Blog ${test.info().project.name}-${Date.now()}`;

      // NOTE: Create one blog so we can like it.
      await page.getByRole("button", { name: "new blog" }).click();
      await page.getByLabel("title").fill(blogTitle);
      await page.getByLabel("author").fill("Test Author");
      await page.getByLabel("url").fill("http://testblog.com");

      await page.getByRole("button", { name: "create" }).click();

      // NOTE: Expand this exact blog row to reveal like button.
      const blogTitleText = page.getByText(blogTitle, { exact: true }).first();
      await expect(blogTitleText).toBeVisible();
      await blogTitleText
        .locator("xpath=ancestor::div[1]//button[normalize-space()='view']")
        .click();

      // NOTE: Verify likes change from 0 to 1 after one click.
      await expect(page.getByText(/likes\s+0/i)).toBeVisible();
      await page.getByRole("button", { name: "like" }).click();
      await expect(page.getByText(/likes\s+1/i)).toBeVisible();
    });

    // NOTE: Verify creator can delete their own blog.
    test("a blog can be deleted by the creator", async ({ page }) => {
      const blogTitle = `Deletable Blog ${test.info().project.name}-${Date.now()}`;

      // NOTE: Create blog that will be deleted.
      await page.getByRole("button", { name: "new blog" }).click();
      await page.getByLabel("title").fill(blogTitle);
      await page.getByLabel("author").fill("Test Author");
      await page.getByLabel("url").fill("http://testblog.com");

      await page.getByRole("button", { name: "create" }).click();

      // NOTE: Expand blog row to show delete/remove button.
      const blogTitleText = page.getByText(blogTitle, { exact: true }).first();
      await expect(blogTitleText).toBeVisible();
      await blogTitleText
        .locator("xpath=ancestor::div[1]//button[normalize-space()='view']")
        .click();

      // NOTE: Handle confirmation dialog and delete the blog.
      page.once("dialog", async (dialog) => {
        await dialog.accept();
      });
      await page.getByRole("button", { name: /remove|delete/i }).click();

      // NOTE: Blog title should no longer exist in the page.
      await expect(page.getByText(blogTitle, { exact: true })).toHaveCount(0);
    });

    // NOTE: Permission test: non-creator must not see delete/remove control.
    test("only the creator can see the delete button", async ({
      page,
      request,
    }) => {
      const blogTitle = `Protected Blog ${test.info().project.name}-${Date.now()}`;
      const otherUser = {
        username: `otheruser-${test.info().project.name}-${Date.now()}`,
        name: "Other User",
        password: "OtherUser222",
      };

      // NOTE: Create second user (non-owner).
      const otherUserResponse = await postWithRetry(
        request,
        "http://localhost:3003/api/users",
        {
          data: otherUser,
        },
      );
      expect(otherUserResponse.ok()).toBeTruthy();

      // NOTE: Current logged-in user (creator) creates the blog.
      await page.getByRole("button", { name: "new blog" }).click();
      await page.getByLabel("title").fill(blogTitle);
      await page.getByLabel("author").fill("Test Author");
      await page.getByLabel("url").fill("http://testblog.com");
      await page.getByRole("button", { name: "create" }).click();

      // NOTE: Creator should see delete/remove after opening details.
      const creatorBlogTitle = page.getByText(blogTitle, { exact: true }).first();
      await expect(creatorBlogTitle).toBeVisible();
      await creatorBlogTitle
        .locator("xpath=ancestor::div[1]//button[normalize-space()='view']")
        .click();
      await expect(
        page.getByRole("button", { name: /remove|delete/i }),
      ).toBeVisible();

      // NOTE: Switch session to non-creator.
      await page.getByRole("button", { name: /logout/i }).click();
      await page.getByLabel("username").fill(otherUser.username);
      await page.getByLabel("password").fill(otherUser.password);
      await page.getByRole("button", { name: "login" }).click();

      // NOTE: If blog is visible to non-creator, open details first.
      // Final rule: non-creator must not see delete/remove button.
      const otherUserBlogTitle = page.getByText(blogTitle, { exact: true });
      if ((await otherUserBlogTitle.count()) > 0) {
        await otherUserBlogTitle
          .first()
          .locator("xpath=ancestor::div[1]//button[normalize-space()='view']")
          .click();
      }

      await expect(
        page.getByRole("button", { name: /remove|delete/i }),
      ).toHaveCount(0);
    });

    // NOTE: Advanced test: list should reorder by likes (highest first).
    test("blogs are ordered by likes, most likes first", async ({ page }) => {
      const firstBlog = `Order Blog A ${test.info().project.name}-${Date.now()}`;
      const secondBlog = `Order Blog B ${test.info().project.name}-${Date.now() + 1}`;
      const thirdBlog = `Order Blog C ${test.info().project.name}-${Date.now() + 2}`;

      // NOTE: Helper to create one blog from UI.
      const createBlog = async (title) => {
        const newBlogButton = page.getByRole("button", {
          name: /new blog|create new blog/i,
        });

        // NOTE: Open creation form if button exists.
        if ((await newBlogButton.count()) > 0) {
          await newBlogButton.first().click();
        }

        // NOTE: Fill and submit blog form.
        await page.getByLabel("title").fill(title);
        await page.getByLabel("author").fill("Test Author");
        await page.getByLabel("url").fill("http://testblog.com");
        await page.getByRole("button", { name: "create" }).click();
        await expect(page.getByText(title, { exact: true })).toBeVisible();
      };

      // NOTE: Helper to like a blog N times and verify each increment.
      const likeBlog = async (title, times) => {
        const blogTitleText = page.getByText(title, { exact: true });
        await blogTitleText
          .locator("xpath=ancestor::div[1]//button[normalize-space()='view']")
          .click();

        // NOTE: Find likes area for current expanded blog.
        const likesSection = page
          .locator("p")
          .filter({ hasText: /likes\s+\d+/i })
          .first();
        const likesText = await likesSection.textContent();
        let likes = Number(likesText?.match(/\d+/)?.[0] ?? 0);

        // NOTE: Click like repeatedly and assert count updates each time.
        for (let i = 0; i < times; i += 1) {
          await likesSection.getByRole("button", { name: "like" }).click();
          likes += 1;
          await expect(likesSection).toContainText(`likes ${likes}`);
        }

        // NOTE: Collapse row to keep UI stable before next interaction.
        const hideButton = blogTitleText.locator(
          "xpath=ancestor::div[1]//button[normalize-space()='hide']",
        );
        if ((await hideButton.count()) > 0) {
          await hideButton.click();
        }
      };

      await createBlog(firstBlog);
      await createBlog(secondBlog);
      await createBlog(thirdBlog);

      // NOTE: Set likes so order should be: second (2), first (1), third (0).
      await likeBlog(secondBlog, 2);
      await likeBlog(firstBlog, 1);

      const expectedOrder = [secondBlog, firstBlog, thirdBlog];

      // NOTE: Poll because reordering can happen asynchronously after likes update.
      await expect
        .poll(async () => {
          const titlesInDomOrder = await page
            .locator("strong")
            .allTextContents();
          const selectedTitles = titlesInDomOrder.filter((title) =>
            expectedOrder.includes(title),
          );
          return selectedTitles.slice(0, 3).join(" | ");
        })
        .toBe(expectedOrder.join(" | "));
    });
  });
});
