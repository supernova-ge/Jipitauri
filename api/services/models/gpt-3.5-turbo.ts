import { ChatCompletionRequestMessage, Configuration, OpenAIApi } from "openai";

export default class Turbo {
  configuration: Configuration;
  openai: OpenAIApi;

  constructor(configuration: Configuration) {
    this.configuration = configuration;
    this.openai = new OpenAIApi(configuration);
  }

  async getOutput(
    messages: Array<ChatCompletionRequestMessage>
  ): Promise<string> {
    const { data } = await this.openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages,
    });

    console.log({
      model: "gpt-3.5-turbo",
      messages,
    });
    console.log(data.choices[0].message?.content);

    return data.choices[0].message?.content as string;
  }
}
