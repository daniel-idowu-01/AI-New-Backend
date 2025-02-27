import axios from "axios";

export const extractEmailDetails = (text) => {
  const toMatch = text.match(/to ([\w.-]+@[\w.-]+\.\w+)/);
  const subjectMatch =
    text.match(/subject (.+?) message/i) || "Unknown Subject";
  const messageMatch =
    text.match(/message (.+)$/i) || text.match(/about (.+)$/i);

  if (toMatch && subjectMatch && messageMatch) {
    return {
      to: toMatch[1],
      subject: subjectMatch[1],
      message: messageMatch[1],
    };
  }
  return null;
};

export const extractEventDetails = async (text) => {
  const response = await axios.post(`${process.env.PYTHON_AI_URL}/extract-event/`, { text });
  return response.data.event;
};
