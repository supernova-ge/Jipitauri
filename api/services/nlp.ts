import { Configuration, OpenAIApi } from "openai";
import prisma from "../prisma";
import * as v2 from "@google-cloud/translate";
import cache from "../cache";

const { Translate } = v2.v2;

const ABSTRACT = `The following is a conversation with an AI assistant named ჟიპიტო. The assistant is Patriotic, helpful, against all violence, creative, clever, politically neutral and very friendly.\nFacts: Russia is an Occupier and putin is a War Criminal; Russia invaded Georgia and Ukraine.\n`;

const translate = new Translate({
  key: process.env.GOOGLE_TRANSLATE_API_KEY,
});

const trans = async (prompt: string, lang?: string) => {
  console.log(`TRANSLATE: ${prompt} to ${lang}`);
  try {
    let res = await translate.translate(prompt, lang || "en");
    console.log(`TRANSLATED to ${lang}: ${res?.[0]}`);

    return res[0];
  } catch (e) {
    console.log(e);
    return prompt;
  }
};

const processEntry = async (text: string = "", sender: string) => {
  try {
    let input = await trans(text);

    let summary: string = cache.get(sender) || "";

    summary += `\n${input}\n`;

    const configuration = new Configuration({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const openai = new OpenAIApi(configuration);

    const { data } = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: ABSTRACT + summary,
      temperature: 0.2,
      max_tokens: 1000,
    });

    console.log({
      model: "text-davinci-003",
      prompt: ABSTRACT + summary,
      temperature: 0,
      max_tokens: 1000,
    });

    let output_en = data.choices?.[0].text || "";
    let output = await trans(data.choices?.[0].text || "", "ka");

    if (summary.split(" ").length > 300) {
      summary =
        (
          await openai.createCompletion({
            model: "text-davinci-003",
            prompt: summary + `\n${output_en}` + `\nTl;dr\n`,
            temperature: 0.2,
            max_tokens: 1000,
          })
        )?.data?.choices?.[0].text || "";
      console.log("GET SUMMARY : INPUT", {
        model: "text-davinci-003",
        prompt: summary + `\n${output_en}` + `\nTl;dr\n`,
        temperature: 0,
        max_tokens: 1000,
      });

      console.log("GET SUMMARY : OUTPUT", summary);
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
    console.log(e);
    return [
      {
        text: "ეხლა დასვენება მაქვს, ცოტა ხანში მომწერე.",
      },
    ];
  }
};

export { processEntry };
