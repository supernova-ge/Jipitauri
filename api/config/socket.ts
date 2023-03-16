import { Server as socketServer } from "socket.io";
import { Server as httpServer } from "http";
import { Processor } from "../services/chat.completion";
import prisma from "../prisma";

const setupWebSockets = (server: httpServer) => {
  const io = new socketServer(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST", "OPTIONS", "PUT", "PATCH", "DELETE"],
      allowedHeaders: ["*"],
    },
  });

  io.on("connection", (socket) => {
    const processor = new Processor();

    console.log(`connected ${socket.id}`);
    socket.on("join", async (client: string) => {
      socket.join(socket.id);
    });
    socket.on("feedback", async (data: { value: string; message: string }) => {
      try {
        console.log(data);

        await prisma.feedback.create({
          data: {
            value: data.value,
            message: data.message,
          },
        });
        socket.emit("feedback_received", "Thank you for your feedback");
      } catch (e) {}
    });
    socket.on("textMessage", async (msg) => {
      let data = await processor
        .use("gpt-3.5-turbo")
        .format(msg, socket.id)
        .then((t) => t.resolve());

      socket.emit("data", {
        message: data?.[0]?.text || "",
      });
    });
    socket.on("disconnect", () => {
      console.log(`Client disconnected ${socket.id}`);
    });
  });
};

export { setupWebSockets };
