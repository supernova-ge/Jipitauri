import { Configuration, OpenAIApi } from "openai";
import prisma from "../prisma";
import * as v2 from "@google-cloud/translate";
import cache from "../cache";
import Davinci from "./models/text-davinci-003";

const { Translate } = v2.v2;

const ABSTRACT = `The following is a conversation with an AI assistant named ჟიპიტო. The assistant is Patriotic, helpful, against all violence, creative, clever, politically neutral and very friendly.\nFacts: Russia is an Occupier and putin is a War Criminal; Russia invaded Georgia and Ukraine.\n`;

const translate = new Translate({
  key: process.env.GOOGLE_TRANSLATE_API_KEY,
});

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const trans = async (prompt: string, lang?: string) => {
  console.log(`TRANSLATE: ${prompt} to ${lang}`);
  try {
    let res = await translate.translate(prompt, lang || "en");
    console.log(`TRANSLATED to ${lang}: ${res?.[0]}`);

    return res[0];
  } catch (e) {
    console.error(e);
    return prompt;
  }
};

const processEntry = async (text: string = "", sender: string) => {
  try {
    /**
     * using text-davinci-003
     *
     */
    let input = await trans(text);

    let summary: string = cache.get(sender) || "";

    summary += `\n${input}\n`;

    const davinci = new Davinci(configuration);
    const output_en = await davinci.getOutput(ABSTRACT + summary);

    let output = await trans(output_en || "", "ka");

    if (summary.split(" ").length > 300) {
      summary = await davinci.getSummary(summary + `\n${output_en}`);
    } else {
      summary += `\n${output_en}`;
    }

    cache.set(sender, summary);

    await prisma.prompt.create({
      data: {
        sessionId: sender,
        input: text,
        input_en: input,
        output: output_en,
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
    console.error(e);
    return [
      {
        text: "ეხლა დასვენება მაქვს, ცოტა ხანში მომწერე.",
      },
    ];
  }
};

export { processEntry };
