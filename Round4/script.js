document.addEventListener("DOMContentLoaded", () => {
    const editor = document.getElementById("editor");
    const output = document.getElementById("output");
    const themeToggle = document.getElementById("theme-toggle");
    const languageSelector = document.getElementById("language-selector");

    // Theme Toggle
    themeToggle.addEventListener("click", () => {
        document.body.classList.toggle("dark-mode");
        themeToggle.innerHTML = document.body.classList.contains("dark-mode")
            ? '<i class="fas fa-sun"></i>'
            : '<i class="fas fa-moon"></i>';
    });

    // Disable Copy-Paste in the Editor
    editor.addEventListener("copy", (e) => {
        e.preventDefault();
        alert("Copying is disabled in the editor!");
    });

    editor.addEventListener("paste", (e) => {
        e.preventDefault();
        alert("Pasting is disabled in the editor!");
    });

    // Clear Code
    document.getElementById("clear-code").addEventListener("click", () => {
        editor.value = "";
    });

    // Clear Output
    document.getElementById("clear-output").addEventListener("click", () => {
        output.value = "Output will be displayed here...";
    });

    // Download Code
    document.getElementById("download-code").addEventListener("click", () => {
        const blob = new Blob([editor.value], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "code.txt";
        link.click();
        URL.revokeObjectURL(url);
    });

    // Run Code
    document.getElementById("run-code").addEventListener("click", async () => {
        const language = languageSelector.value;
        const code = editor.value.trim();
        const userInput = output.value.trim();

        if (!code) {
            output.value = "Please write some code to execute.";
            return;
        }

        output.value = "Executing code... Please wait.";

        try {
            const response = await fetch("http://localhost:5000/execute", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ language, code, input: userInput }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                output.value = `Error: ${errorData.error || "Execution failed."}`;
                return;
            }

            const result = await response.json();
            output.value = result.output;
        } catch (error) {
            output.value = `Error: ${error.message}`;
        }
    });

    // Submit Code
    document.getElementById("submit-code").addEventListener("click", () => {
        alert("Code submitted successfully!");
    });
});
