import { ChatCompletionRequestMessage, Configuration, OpenAIApi } from "openai";

export default class Turbo {
  configuration: Configuration;
  openai: OpenAIApi;

  constructor(configuration: Configuration) {
    this.configuration = configuration;
    this.openai = new OpenAIApi(configuration);
  }

  async getOutput(messages: Array<ChatCompletionRequestMessage>): Promise<string> {
    try {
      const { data } = await this.openai.createChatCompletion({
        model: "tbilisi-ai-lab-2.0",
        messages,
        temperature: 0.2,
        max_tokens: 1000,
      });

      console.log({
        model: "tbilisi-ai-lab-2.0",
        messages,
      });

      return data.choices[0].message?.content as string;
    } catch (e) {
      return "";
    }
  }

  async getSummary(uin: string) {
    let messages: ChatCompletionRequestMessage[] = [
      {
        role: "user",
        content: uin + `\nTl;dr\n`,
      },
    ];

    try {
      const { data } = await this.openai.createChatCompletion({
        model: "tbilisi-ai-lab-2.0",
        messages,
        temperature: 0.2,
        max_tokens: 1000,
      });

      console.log({
        model: "tbilisi-ai-lab-2.0",
        messages,
      });

      return data.choices[0].message?.content as string;
    } catch (e) {
      return "";
    }
  }
}
