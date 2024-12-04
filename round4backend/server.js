const express = require("express");
const { spawn } = require("child_process");
const path = require("path");
const fs = require("fs");
const cors = require("cors");

const app = express();
const port = 5000;

// Middleware
app.use(express.json());
app.use(cors());

// Route to execute the code
app.post("/execute", (req, res) => {
    const { language, code, input } = req.body;

    if (!language || !code) {
        return res.status(400).json({ error: "Language and code are required." });
    }

    const filePath = path.join(__dirname, "temp");
    let fileName, command, args;

    switch (language) {
        case "python":
            fileName = "temp.py";
            command = "python";
            args = [path.join(filePath, fileName)];
            break;
        case "c":
            fileName = "temp.c";
            command = "gcc";
            args = [
                path.join(filePath, fileName),
                "-o",
                path.join(filePath, "temp.out"),
            ];
            break;
        case "java":
            fileName = "Temp.java";
            command = "javac";
            args = [path.join(filePath, fileName)];
            break;
        default:
            return res.status(400).json({ error: "Unsupported language." });
    }

    // Ensure temp directory exists
    if (!fs.existsSync(filePath)) {
        fs.mkdirSync(filePath);
    }

    // Write code to a file
    fs.writeFileSync(path.join(filePath, fileName), code);

    if (language === "c") {
        // Compile and run C code
        const compile = spawn("gcc", args);
        compile.on("close", (code) => {
            if (code !== 0) {
                return res.status(500).json({ error: "Compilation failed." });
            }
            const run = spawn(path.join(filePath, "temp.out"));
            handleExecution(run, input, res);
        });
    } else if (language === "java") {
        // Compile and run Java code
        const compile = spawn("javac", args);
        compile.on("close", (code) => {
            if (code !== 0) {
                return res.status(500).json({ error: "Compilation failed." });
            }
            const run = spawn("java", ["-cp", filePath, "Temp"]);
            handleExecution(run, input, res);
        });
    } else {
        // Run Python code
        const run = spawn(command, args);
        handleExecution(run, input, res);
    }
});

// Function to handle execution
function handleExecution(process, input, res) {
    let output = "";
    let error = "";

    if (input) {
        process.stdin.write(input + "\n");
        process.stdin.end();
    }

    process.stdout.on("data", (data) => {
        output += data.toString();
    });

    process.stderr.on("data", (data) => {
        error += data.toString();
    });

    process.on("close", (code) => {
        if (code !== 0) {
            return res.status(500).json({ error: error || "Execution failed." });
        }
        res.json({ output });
    });
}

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
