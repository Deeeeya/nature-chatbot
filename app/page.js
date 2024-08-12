"use client";
import { Box, Button, Stack, TextField } from "@mui/material";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Home() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: `Welcome to the Botanists' Support Hub! 🌿`,
    },
  ]);

  const [message, setMessage] = useState("");

  const sendMessage = async () => {
    setMessage("");
    setMessages((messages) => [
      ...messages,
      { role: "user", content: message },
      { role: "assistant", content: "" },
    ]);
    const response = fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify([...messages, { role: "user", content: message }]),
    }).then(async (res) => {
      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      let result = "";
      return reader.read().then(function processText({ done, value }) {
        if (done) {
          return result;
        }
        const text = decoder.decode(value || new Int8Array(), { stream: true });
        setMessages((messages) => {
          let lastMessage = messages[messages.length - 1];
          let otherMessages = messages.slice(0, messages.length - 1);
          return [
            ...otherMessages,
            {
              ...lastMessage,
              content: lastMessage.content + text,
            },
          ];
        });
        return reader.read().then(processText);
      });
    });
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <Box
      className="box-position"
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
    >
      <Box
        className="title-box"
        width="600px"
        height="100px"
        bgcolor="#32746D"
        borderRadius="2rem 2rem 0 0"
        display="flex"
        alignItems="center"
        flexDirection="row"
      >
        <Image
          className="bot-icon"
          src="/chatbot (1).png"
          alt="icon"
          width="100"
          height="100"
        ></Image>
        <h1 class="title">Nature Bot</h1>
      </Box>
      <Stack
        zIndex={2}
        className="main-box"
        direction="column"
        bgcolor="#FFFADA"
        borderRadius="0 0 2rem 2rem"
        width="600px"
        height="700px"
        p={2}
        spacing={3}
      >
        <Stack
          className="chat-box"
          direction="column"
          spacing={2}
          flexGrow={1}
          overflow="auto"
          maxHeight="100%"
        >
          {messages.map((message, index) => (
            <Box
              width={message.role === "assistant" ? "350px" : null}
              key={index}
              display="flex"
              justifyContent={
                message.role === "assistant" ? "flex-start" : "flex-end"
              }
            >
              <Box
                bgcolor={message.role === "assistant" ? "#C3E8CF" : "#97CEA9"}
                fontSize="18px"
                color="011502e"
                borderRadius={7}
                p={2}
              >
                {message.content}
              </Box>
            </Box>
          ))}
        </Stack>
        <Stack
          direction="row"
          alignItems="center"
          spacing={2}
          borderTop="5px solid #32746D"
          paddingTop="5px"
        >
          <input
            placeholder="Enter your message..."
            style={{
              width: "100%",
              height: "100%",
              backgroundColor: "transparent",
              border: "none",
              outline: "none",
              fontSize: "25px",
              fontWeight: "bold",
              color: "#32746D",
              caretColor: "transparent",
            }}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyPress}
          />
          <Button variant="text" onClick={sendMessage}>
            <Image
              src="/Paper Plane.svg"
              alt="send button"
              width="60"
              height="60"
            />
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}
