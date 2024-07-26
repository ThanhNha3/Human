// Lesson #4
import express from 'express';
import { configDotenv } from "dotenv";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
// import { StructuredOutputParser } from "@langchain/core/output_parsers";
import { StringOutputParser } from "@langchain/core/output_parsers";

import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { Document } from "@langchain/core/documents";
import { z } from "zod";
import cors from "cors"

configDotenv();

const app = express();
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cors({
    origin: "*"
}))
const model = new ChatGoogleGenerativeAI({
    apiKey: process.env.GEMINI_API_KEY,
    modelName: "gemini-pro",
    temperature: 0.7,
    maxTokens: 1000,
})

const runChain = async (roughSymptom, document) => {
    try {
        const prompt = ChatPromptTemplate.fromTemplate(
            `Từ tài liệu context, hãy trả về cho tôi các triệu chứng giống hoặc có biểu hiện tương tự từ roughSymptom mà tôi cung cấp.
            Kết quả trả về được cách nhau bởi dấu phẩy.
            
            roughSymptom: {roughSymptom}
            context: {context}

            `
        );

        const parser = new StringOutputParser();

        const chain = prompt.pipe(model).pipe(parser);
        const arraySymptomsName = document.map((item) => item.name.trim());
        const stringSymptomsName = arraySymptomsName.join(", ");

        const response = await chain.invoke({
            roughSymptom: roughSymptom,
            context: [stringSymptomsName],
        });
        // console.log(await prompt.format({
        //     roughSymptom: roughSymptom,
        //     context: stringSymptomsName
        // }));
        return response;
    } catch (err) {
        console.log(err);
    }
}

// Mới thêm
const predictSickness = async (document) => {
    try {
        const prompt = ChatPromptTemplate.fromTemplate(
            `Từ tài liệu context, hãy trả về cho tôi các triệu chứng giống hoặc có biểu hiện tương tự từ roughSymptom mà tôi cung cấp.
            Kết quả trả về được cách nhau bởi dấu phẩy.
            
            roughSymptom: {roughSymptom}
            context: {context}

            `
        );

        const parser = new StringOutputParser();

        const chain = prompt.pipe(model).pipe(parser);
        const arraySymptomsName = document.map((item) => item.name.trim());
        const stringSymptomsName = arraySymptomsName.join(", ");

        const response = await chain.invoke({
            roughSymptom: roughSymptom,
            context: [stringSymptomsName],
        });
        // console.log(await prompt.format({
        //     roughSymptom: roughSymptom,
        //     context: stringSymptomsName
        // }));
        return response;
    } catch (err) {
        console.log(err);
    }
}



// End

app.post("/api/generateSpecializedSymptoms", async (req, res) => {
    const { roughSymptom, document } = req.body;
    const result = await runChain(roughSymptom, document);
    res.json(result);
})


app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});


