const { test, expect } = require('@playwright/test');

/**
 * Test: Create WordPress Post with Hide on Mobile setting
 * 
 * This test verifies the following workflow:
 * 1. Login to WordPress admin
 * 2. Create a new post
 * 3. Add a paragraph block with Lorem Ipsum text
 * 4. Enable "Hide on Mobile" visibility setting
 * 5. Publish the post
 * 6. View the published post
 */
test.describe('WordPress Post Creation with Block Visibility', () => {

    test.beforeEach(async ({ page }) => {
        // Login to WordPress admin
        await page.goto('/wp-admin');

        // Check if already logged in
        const isLoginPage = await page.locator('#loginform').isVisible().catch(() => false);

        if (isLoginPage) {
            await page.fill('#user_login', process.env.WP_USERNAME || 'admin');
            await page.fill('#user_pass', process.env.WP_PASSWORD || 'password');
            await page.click('#wp-submit');

            // Wait for redirect to admin dashboard
            await page.waitForURL(/wp-admin/);
        }
    });

    test('should create a post with hide on mobile setting and publish it', async ({ page }) => {
        // 1) New post
        await page.goto('/wp-admin/post-new.php', { waitUntil: 'domcontentloaded' });

        // Editor ready
        await page.waitForSelector('body.block-editor-page');

        // 2) Reliably disable Welcome Guide (not blind "toggle")
        await page.evaluate(() => {
            const dispatch = wp.data.dispatch('core/edit-post');
            const select = wp.data.select('core/edit-post');

            // If available: set explicitly
            if (dispatch.setPreference) {
                dispatch.setPreference('welcomeGuide', false);
                return;
            }

            // Fallback: only toggle if currently active
            if (select && select.isFeatureActive && dispatch.toggleFeature) {
                const isOn = select.isFeatureActive('welcomeGuide');
                if (isOn) dispatch.toggleFeature('welcomeGuide');
            }
        });

        // Optional: if modal still appears (race condition), try "Close"
        const closeWelcome = page.getByRole('button', { name: /close/i });
        if (await closeWelcome.first().isVisible().catch(() => false)) {
            await closeWelcome.first().click();
        }

        // 3) Set title (more robust: Role textbox + Fallback selector)
        const title = page.locator('iframe[name="editor-canvas"]').contentFrame().getByRole('textbox', { name: 'Add title' });
        await title.click();
        await title.fill('Test Post mit Hide on Mobile');

        // 4) Content: Type paragraph into editor
        await page.keyboard.press('Enter');
        const loremIpsumText =
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.';
        await page.keyboard.type(loremIpsumText);

        // Select paragraph (instead of text locator -> click block canvas)
        // Click in editor area near the text:
        await page.locator('iframe[name="editor-canvas"]').contentFrame().getByRole('document', { name: 'Block: Paragraph' }).click();

        // 5) Open sidebar (Settings)
        const sidebar = page.getByText('PostBlockParagraphStart with');
        if (!(await sidebar.isVisible().catch(() => false))) {
            // Button name varies by language: "Settings" / "Einstellungen"
            const settingsButton = page.getByRole('button', { name: 'Settings' });
            await settingsButton.click();
            await expect(sidebar).toBeVisible({ timeout: 10000 });
        }

        // 6) Activate Block tab (not Document)
        const blockTab = page.getByRole('tab', { name: 'Block' });
        if (await blockTab.isVisible().catch(() => false)) {
            await blockTab.click();
        }

        // 7) Find and activate "Hide on Mobile" control
        // Robust: first find text, then click nearby checkbox/toggle.
        const hideLabel = page.getByText('Hide on mobile', { exact: true });
        await expect(hideLabel).toBeVisible({ timeout: 10000 });
        await hideLabel.scrollIntoViewIfNeeded();

        // Try typical toggle/checkbox structures:
        await page.getByRole('checkbox', { name: 'Hide on mobile' }).click();

        // 8) Robust publish flow
        const publish = page.getByRole('button', { name: 'Publish', exact: true });
        await publish.click();

        // Confirmation dialog/panel (2nd publish click)
        const confirmPublish = page.locator('.editor-post-publish-panel button:has-text("Publish"), .editor-post-publish-panel button:has-text("Veröffentlichen")').first();
        if (await confirmPublish.isVisible().catch(() => false)) {
            await confirmPublish.click();
        }

        // 9) Published confirmation
        await page.waitForSelector('text=/post published|beitrag veröffentlicht/i', { timeout: 20000 });

        // 10) View Post Link
        const viewPostLink = page.locator('a:has-text("View Post"), a:has-text("Beitrag ansehen")').first();
        await expect(viewPostLink).toBeVisible({ timeout: 10000 });

        const postUrl = await viewPostLink.getAttribute('href');
        if (!postUrl) throw new Error('View Post link has no href');

        // 11) Check frontend
        await page.goto(postUrl, { waitUntil: 'domcontentloaded' });
        await expect(page.locator(`text=${loremIpsumText.substring(0, 30)}`)).toBeVisible({ timeout: 20000 });

        // 12) Mobile viewport: relocate after viewport change
        await page.setViewportSize({ width: 375, height: 667 });
        await page.waitForTimeout(300);

        const paragraphMobile = page.locator(`text=${loremIpsumText.substring(0, 30)}`).first();

        const isHidden = await paragraphMobile.evaluate((el) => {
            const style = window.getComputedStyle(el);
            return style.display === 'none' || style.visibility === 'hidden' || el.offsetParent === null;
        });

        expect(isHidden).toBeTruthy();

        // 13) Desktop viewport: relocate and expect visible
        await page.setViewportSize({ width: 1920, height: 1080 });
        await page.waitForTimeout(300);

        const paragraphDesktop = page.locator(`text=${loremIpsumText.substring(0, 30)}`).first();
        await expect(paragraphDesktop).toBeVisible({ timeout: 10000 });
    });
});
