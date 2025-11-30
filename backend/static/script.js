console.log("✅ script.js loaded");

const analyzeBtn = document.getElementById("analyzeBtn");
analyzeBtn.addEventListener("click", analyzeBusiness);

// Setup score animation
const circle = document.getElementById("scoreCircle");
const radius = 80;
const circumference = 2 * Math.PI * radius;
circle.style.strokeDasharray = circumference;
circle.style.strokeDashoffset = circumference;

async function analyzeBusiness() {
    const input = document.getElementById("businessInput").value;
    const resultDiv = document.getElementById("result");
    const scoreValue = document.getElementById("scoreValue");
    const weaknessBox = document.getElementById("weaknessBox");
    const weaknessList = document.getElementById("weaknessList");

    if (!input.trim()) {
        resultDiv.innerHTML = "Please enter a business description.";
        return;
    }

    resultDiv.innerHTML = "🔍 Analyzing your business...";
    scoreValue.textContent = "--";
    weaknessBox.style.display = "none";
    weaknessList.innerHTML = "";

    try {
        const response = await fetch("/analyze", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text: input })
        });

        const data = await response.json();
        console.log("Response:", data);

        // ✅ EXECUTIVE SUMMARY
document.getElementById("summaryText").textContent =
    data.summary || "No executive summary provided.";

// ✅ PRIORITY LEVEL
const priorityBadge = document.getElementById("priorityLevel");

if (data.priority) {
    priorityBadge.textContent = data.priority;

    if (data.priority === "HIGH") {
        priorityBadge.style.color = "#ef4444"; // red
    } else if (data.priority === "MEDIUM") {
        priorityBadge.style.color = "#eab308"; // yellow
    } else {
        priorityBadge.style.color = "#22c55e"; // green
    }
}


        // SCORE
        if (data.score != null) {
            const offset = circumference - (data.score / 100) * circumference;
            circle.style.strokeDashoffset = offset;
            scoreValue.textContent = data.score + "/100";

            circle.style.stroke =
                data.score >= 80 ? "#22c55e" :
                data.score >= 60 ? "#eab308" : "#ef4444";
        }

        // AI WEAKNESSES
        if (data.weaknesses && data.weaknesses.length) {
            weaknessBox.style.display = "block";
            data.weaknesses.forEach(item => {
                const li = document.createElement("li");
                li.textContent = item;
                weaknessList.appendChild(li);
            });
        }

        // REPORT
        resultDiv.innerHTML = data.report
            .replace(/\n/g, "<br>")
            .replace(/Efficiency Improvements:/g, "<h3> Efficiency Improvements</h3>")
            .replace(/Scalability:/g, "<h3> Scalability</h3>")
            .replace(/Risk Reduction:/g, "<h3> Risk Reduction</h3>")
            .replace(/Revenue Growth:/g, "<h3> Revenue Growth</h3>");

    } catch (err) {
        console.error(err);
        resultDiv.innerHTML = "❌ Error analyzing business.";
    }
}
