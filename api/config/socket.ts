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
    socket.on("feedback_remove", async (data: {message_id: string}) => {
      try {
        await prisma.feedback_new.delete({
          where:{
            message: data.message_id,
          }
        });
        console.log("FEEDBACK_DELETED: ", data);
      } catch (e) {
        console.log(e)
      }  
    });
    socket.on(
      "feedback",
      async (data: { like : number; contextField : number; contentField : number; convertField : number; optional_feedback: string; message_id: string }) => {
        try {
          await prisma.feedback_new.upsert({
            create: {
              like : data.like,
              contextField : data.contextField,
              contentField : data.contentField,
              convertField : data.convertField,
              optional: data.optional_feedback,
              message: data.message_id,
            },
            update: {
              like : data.like,
              contextField : data.contextField,
              contentField : data.contentField,
              convertField : data.convertField,
              optional: data.optional_feedback,
              message: data.message_id,
            },
            where: {
              message: data.message_id,
            }
          });
          socket.emit("feedback_received", "Thank you for your feedback");
          console.log("FEEDBACK:: ", data);
        } catch (e) {
          console.log(e);
        }
      }
    );
    socket.on("textMessage", async (msg) => {
      let data = await processor
        .use("gpt-3.5-turbo")
        .format(msg, socket.id)
        .then((t) => t.resolve());

      socket.emit("data", {
        message: data[0]?.text || "",
        message_id: data[0]?.message_id || "",
      });
    });
    socket.on("disconnect", () => {
      console.log(`Client disconnected ${socket.id}`);
    });
  });
};

export { setupWebSockets };
