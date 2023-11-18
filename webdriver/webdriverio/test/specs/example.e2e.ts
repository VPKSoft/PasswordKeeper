describe("Hello Tauri", () => {
    it("page loaded correctly", async () => {
        const div = await $("#left");
        await expect(div).toExist();
    });
});
