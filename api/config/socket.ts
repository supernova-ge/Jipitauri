import { Server as socketServer } from "socket.io";
import { Server as httpServer } from "http";
import { processEntry } from "../services/chat.completion";
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
      let data = await processEntry(msg, socket.id);
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
