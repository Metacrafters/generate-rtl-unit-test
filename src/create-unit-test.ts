import fs from "fs";
import { writeFile } from "fs/promises";
import path from "path";
import axios from "axios";

async function readFile(filePath: string) {
  const buffer = await fs.promises.readFile(filePath);
  return buffer.toString();
}

async function generateUnitTest(componentPath: string, apiKey: string) {
  const componentFile = path.parse(componentPath);
  const componentCode = await readFile(componentPath);

  const response = await axios.post(
    "https://api.openai.com/v1/chat/completions",
    {
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: `Please write a unit test for the following component in TypeScript using Jest and React Testing Library. The component can be imported from the same directory as the unit test.\n\n${componentCode}\n`,
        },
      ],
      max_tokens: 3024,
      n: 1,
      temperature: 0.5,
    },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
    }
  );

  const testCode = response.data.choices[0].message.content.trim();
  const testFilePath = path.join(
    componentFile.dir,
    `${componentFile.name}.test.tsx`
  );
  await writeFile(testFilePath, testCode);
  console.log(`Unit test generated at ${testFilePath}`);
}

export default generateUnitTest;
