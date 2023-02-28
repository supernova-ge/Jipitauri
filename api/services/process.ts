import { Configuration, OpenAIApi } from "openai";
import prisma from "../prisma";
import * as v2 from "@google-cloud/translate";

const { Translate } = v2.v2;

const translate = new Translate({
  key: process.env.GOOGLE_TRANSLATE_API_KEY,
});

let convo = new Map<string, string>();

const trans = async (prompt: string, lang?: string) => {
  console.log(`TRANSLATE: ${prompt}`);
  try {
    let res = await translate.translate(prompt, lang || "en");
    console.log(`TRANSLATED: ${res?.[0]}`);

    return res[0];
  } catch (e) {
    console.log(e);
    return prompt;
  }
};

const processEntry = async (text: string = "", sender: string) => {
  try {
    let input = await trans(text);

    let summary = convo.get(sender) || "";

    let prompt = summary + `\n${input}\n`;

    const configuration = new Configuration({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const openai = new OpenAIApi(configuration);

    const { data } = await openai.createCompletion({
      model: "text-davinci-003",
      prompt,
      temperature: 0,
      max_tokens: 1000,
    });

    console.log({
      model: "text-davinci-003",
      prompt,
      temperature: 0,
      max_tokens: 1000,
    });

    let output = await trans(data.choices?.[0].text || "", "ka");

    summary =
      (
        await openai.createCompletion({
          model: "text-davinci-003",
          prompt: prompt + `\n\nTl;dr\n`,
          temperature: 0,
          max_tokens: 1000,
        })
      )?.data?.choices?.[0].text || "";

    console.log("GET SUMMARY : INPUT", {
      model: "text-davinci-003",
      prompt: prompt + `\n\nTl;dr\n`,
      temperature: 0,
      max_tokens: 1000,
    });

    console.log("GET SUMMARY : OUTPUT", summary);

    convo.set(sender, summary);

    await prisma.prompt.create({
      data: {
        sessionId: sender,
        input: text,
        input_en: input,
        output: data.choices?.[0].text || "",
        output_ge: output || "",
        summary: summary || "",
      },
    });

    return [
      {
        text: output,
      },
    ];
  } catch (e) {
    console.log(e);
    convo = new Map<string, string>();
    return [
      {
        text: "ეხლა დასვენება მაქვს, ცოტა ხანში მომწერე.",
      },
    ];
  }
};

export { processEntry };
