import { useChat } from "ai/react";

type ChatProps = {
  id: string;
};

export default function Chat(props: ChatProps) {
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    keepLastMessageOnError: true,
    api: `/api/chat/${props.id}`,
  });

  return (
    <>
      {messages.map((message) => (
        <div key={message.id}>
          {message.role === "user" ? "User: " : "AI: "}
          {message.content}
        </div>
      ))}

      <form onSubmit={handleSubmit}>
        <input name="prompt" value={input} onChange={handleInputChange} />
        <button type="submit">Submit</button>
      </form>
    </>
  );
}
