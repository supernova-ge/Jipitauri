import { Configuration, OpenAIApi } from "openai";

export default class Davinci {
  prompt: string;
  configuration: Configuration;
  openai: OpenAIApi;

  constructor(prompt: string, configuration: Configuration) {
    this.prompt = prompt;
    this.configuration = configuration;
    this.openai = new OpenAIApi(configuration);
  }

  async getSummary(_prompt: string): Promise<string> {
    let summary: string =
      (
        await this.openai.createCompletion({
          model: "text-davinci-003",
          prompt: _prompt + `\nTl;dr\n`,
          temperature: 0.2,
          max_tokens: 1000,
        })
      )?.data?.choices?.[0].text || "";
    console.log("GET SUMMARY : INPUT", {
      model: "text-davinci-003",
      prompt: _prompt + `\nTl;dr\n`,
      temperature: 0,
      max_tokens: 1000,
    });

    console.log("GET SUMMARY : OUTPUT", summary);
    return summary;
  }

  async getOutput(): Promise<string> {
    const { data } = await this.openai.createCompletion({
      model: "text-davinci-003",
      prompt: this.prompt,
      temperature: 0.2,
      max_tokens: 1000,
    });

    console.log({
      model: "text-davinci-003",
      prompt: this.prompt,
      temperature: 0.2,
      max_tokens: 1000,
    });

    let output_en = data.choices?.[0].text || "";
    return output_en;
  }
}
