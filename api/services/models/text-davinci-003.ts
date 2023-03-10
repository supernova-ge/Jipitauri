import { Configuration, OpenAIApi } from "openai";

export default class Davinci {
  configuration: Configuration;
  openai: OpenAIApi;

  constructor(configuration: Configuration) {
    this.configuration = configuration;
    this.openai = new OpenAIApi(configuration);
  }

  async getSummary(prompt: string): Promise<string> {
    let summary: string =
      (
        await this.openai.createCompletion({
          model: "text-davinci-003",
          prompt: prompt + `\nTl;dr\n`,
          temperature: 0.2,
          max_tokens: 1000,
        })
      )?.data?.choices?.[0].text || "";
    console.log("GET SUMMARY : INPUT", {
      model: "text-davinci-003",
      prompt: prompt + `\nTl;dr\n`,
      temperature: 0,
      max_tokens: 1000,
    });

    console.log("GET SUMMARY : OUTPUT", summary);
    return summary;
  }

  async getOutput(prompt: string): Promise<string> {
    const { data } = await this.openai.createCompletion({
      model: "text-davinci-003",
      prompt: prompt,
      temperature: 0.2,
      max_tokens: 1000,
    });

    console.log({
      model: "text-davinci-003",
      prompt: prompt,
      temperature: 0.2,
      max_tokens: 1000,
    });

    let output_en = data.choices?.[0].text || "";
    return output_en;
  }
}
