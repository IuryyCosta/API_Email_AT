import fs from "fs";
import path from "path";

export const htmlFile = (): string => {
    const htmlFile = path.join(__dirname, "./src/templates/email.html");
  

    const htmlContent = fs.readFileSync(htmlFile, "utf-8");

    

    return htmlContent;
}

