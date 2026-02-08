import { storage } from "./storage";

async function seed() {
    console.log("Seeding education modules...");

    try {
        const existingModules = await storage.getAllEducationModules();
        if (existingModules.length > 0) {
            console.log("Education modules already seeded. Skipping.");
            return;
        }

        // Module 1: Credit Fundamentals
        const m1 = await storage.createEducationModule({
            title: "Credit Fundamentals",
            description: "Learn the core components of your credit score and how it's calculated.",
            content: JSON.stringify([
                { title: "What is a Credit Score?", content: "Your credit score is a numerical representation of your creditworthiness..." },
                { title: "FICO vs VantageScore", content: "There are different scoring models used by lenders..." },
                { title: "The 5 Factors", content: "Payment history, amounts owed, length of credit history..." }
            ]),
            orderIndex: 0,
        });

        await storage.createQuiz({
            moduleId: m1.id,
            questions: JSON.stringify([
                { question: "What is the most important factor in your FICO score?", options: ["Payment History", "Credit Mix", "New Credit"], answer: "Payment History" },
                { question: "How many major credit bureaus are there?", options: ["2", "3", "4"], answer: "3" }
            ])
        });

        // Module 2: Advanced Dispute Tactics
        const m2 = await storage.createEducationModule({
            title: "Advanced Dispute Tactics",
            description: "Master the art of disputing inaccuracies with federal consumer laws.",
            content: JSON.stringify([
                { title: "The Fair Credit Reporting Act (FCRA)", content: "Learn about your rights under the FCRA..." },
                { title: "Factual Disputing", content: "How to identify and dispute specific inaccuracies..." }
            ]),
            orderIndex: 1,
        });

        // Module 3: Identity Theft Protection
        const m3 = await storage.createEducationModule({
            title: "Identity Theft Protection",
            description: "Secure your financial future and recover from identity theft.",
            content: JSON.stringify([
                { title: "Signs of Identity Theft", content: "Unauthorized charges, missing bills, etc..." },
                { title: "The Recovery Process", content: "Step-by-step guide to recovering your identity..." }
            ]),
            orderIndex: 2,
        });

        console.log("Education seeding completed successfully.");
    } catch (err) {
        console.error("Seed failed:", err);
    }
}

seed();
