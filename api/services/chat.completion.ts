import { ChatCompletionRequestMessage, Configuration, OpenAIApi } from "openai";
import prisma from "../prisma";
import * as v2 from "@google-cloud/translate";
import cache from "../cache";
import Davinci from "./models/text-davinci-003";
import Turbo from "./models/gpt-3.5-turbo";

const { Translate } = v2.v2;

const ABSTRACT = `The following is a conversation with an AI assistant named ჟიპიტო. The assistant is Patriotic, helpful, against all violence, creative, clever, politically neutral and very friendly.\nFacts: Russia is an Occupier and putin is a War Criminal; Russia invaded Georgia and Ukraine.\n`;

const translate = new Translate({
  key: process.env.GOOGLE_TRANSLATE_API_KEY,
});

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

type Model = "text-davinci-003" | "gpt-3.5-turbo";

/**
 * @service Processor
 */

class Processor {
  public model: string = "text-davinci-003";
  private text: string = "";
  private sender: string = "";
  private summary: string = "";
  private messages: Array<ChatCompletionRequestMessage> = [];
  private input_en: string;
  private output_en: string;
  private output_ge: string;

  constructor() {
    this.input_en = "";
    this.output_en = "";
    this.output_ge = "";
  }

  use(model: Model): this {
    this.model = model;
    return this;
  }

  async davinci(): Promise<void> {
    this.summary = cache.get(this.sender) || "";
    this.summary += `\n${this.input_en}\n`;

    const davinci = new Davinci(configuration);
    this.output_en = await davinci.getOutput(ABSTRACT + this.summary);

    if (this.summary.split(" ").length > 300) {
      this.summary = await davinci.getSummary(
        this.summary + `\n${this.output_en}`
      );
    } else {
      this.summary += `\n${this.output_en}`;
    }

    cache.set(this.sender, this.summary);
  }

  async turbo(): Promise<void> {
    this.messages.push({
      role: "user",
      content: this.input_en,
    });
    const turbo = new Turbo(configuration);
    this.output_en = await turbo.getOutput(this.messages);

    this.messages.push({
      role: "system",
      content: this.output_en,
    });
  }

  async format(text: string = "", sender: string): Promise<this> {
    this.text = text;
    this.sender = sender;
    this.input_en = await this.trans(this.text);

    switch (this.model) {
      case "text-davinci-003":
        await this.davinci();
        break;
      case "gpt-3.5-turbo":
        await this.turbo();
    }

    this.output_ge = await this.trans(this.output_en || "", "ka");

    return this;
  }

  async resolve(): Promise<Array<{ text: string }>> {
    try {
      await prisma.prompt.create({
        data: {
          sessionId: this.sender,
          input: this.text,
          input_en: this.input_en,
          output: this.output_en,
          output_ge: this.output_ge || "",
          summary: this.summary || JSON.stringify(this.messages),
        },
      });
      return [
        {
          text: this.output_ge,
        },
      ];
    } catch (e: any) {
      console.error(e.body);
      return [
        {
          text: "ეხლა დასვენება მაქვს, ცოტა ხანში მომწერე.",
        },
      ];
    }
  }

  /**
   * @service translate
   */

  async trans(prompt: string, lang: string = "en") {
    console.log(`TRANSLATE: ${prompt} : ${lang}`);
    try {
      let res = await translate.translate(prompt, lang);
      console.log(`TRANSLATED : ${res?.[0]}`);

      return res[0];
    } catch (e: any) {
      console.error(e.body);
      return prompt;
    }
  }
}

export { Processor };
