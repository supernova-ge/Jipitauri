import { ChatCompletionRequestMessage, Configuration } from "openai";
import cache from "../cache";
import prisma from "../prisma";
import Turbo from "./models/gpt-3.5-turbo";
import Davinci from "./models/text-davinci-003";

const ABSTRACT = `The following is a conversation with an AI assistant named ჟიპიტო. The assistant is Patriotic, helpful, against all violence, creative, clever, politically neutral and very friendly. Facts: Russia is an Occupier and Putin is a War Criminal; Russia invaded Georgia in 2008 and Ukraine in 2014. `;

const configuration = new Configuration({
  basePath: "https://api.ailab.ge",
  apiKey: process.env.OPENAI_API_KEY,
});

type Model = "text-davinci-003" | "tbilisi-ai-lab-2.0";

/**
 * @service Processor
 */

class Processor {
  public model: string = "tbilisi-ai-lab-2.0";
  private text: string = "";
  private sender: string = "";
  private summary: string = "";
  private messages: Array<ChatCompletionRequestMessage> = [
    {
      role: "system",
      content: ABSTRACT,
    },
  ];
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

  /**
   * @model text-davinci-003
   */

  async davinci(): Promise<void> {
    this.summary = cache.get(this.sender) || "";
    this.summary += `\n${this.input_en}\n`;

    const davinci = new Davinci(configuration);
    this.output_en = await davinci.getOutput(ABSTRACT + this.summary);

    if (this.summary.split(" ").length > 300) {
      this.summary = await davinci.getSummary(this.summary + `\n${this.output_en}`);
    } else {
      this.summary += `\n${this.output_en}`;
    }

    cache.set(this.sender, this.summary);
  }

  /**
   * @model gpt-3.5-turbo
   */

  async turbo(): Promise<void> {
    this.messages.push({
      role: "user",
      content: this.input_en,
    });
    const turbo = new Turbo(configuration);
    this.output_en = await turbo.getOutput(this.messages);

    if (this.messages.reduce((acc, curr) => acc + curr.content, "").split(" ").length > 300) {
      let turbo_summary = await turbo.getSummary(this.messages.reduce((acc, curr) => acc + curr.content, "") + `\n${this.output_en}`);
      this.messages = [
        {
          role: "system",
          content: ABSTRACT + "\n" + turbo_summary,
        },
      ];
    } else {
      this.messages.push({
        role: "assistant",
        content: this.output_en,
      });
    }
  }

  /**
   * @param {string} text
   * @param {string} sender
   * @returns this
   */

  async format(text: string = "", sender: string): Promise<this> {
    this.text = text;
    this.sender = sender;
    this.input_en = this.text;

    switch (this.model) {
      case "text-davinci-003":
        await this.davinci();
        break;
      case "tbilisi-ai-lab-2.0":
        await this.turbo();
    }

    this.output_ge = this.output_en;

    return this;
  }

  /**
   * @returns {string} text
   */

  async resolve(): Promise<Array<{ text: string; message_id: string }>> {
    try {
      let res = await prisma.prompt.create({
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
          message_id: res.id,
        },
      ];
    } catch (e: any) {
      console.error(e);
      return [
        {
          text: "ეხლა დასვენება მაქვს, ცოტა ხანში მომწერე.",
          message_id: "0",
        },
      ];
    }
  }
}

export { Processor };
