import { execSync } from "child_process";
import { readdirSync, readFileSync, writeFileSync } from "fs";

const PROGRAMS_FOLDER = "programs";
const PROGRAM_MAIN_FILE = "src/lib.rs";
const MACRO_NAME = "declare_id!";
const ANCHOR_CONFIG_FILE = "Anchor.toml";

async function main() {
  const programFolders = readdirSync(PROGRAMS_FOLDER);
  const keysList = execSync("anchor keys list", {
    encoding: "utf-8",
  });
  const keysListArray = keysList.split("\n");
  let anchorConfigContents = readFileSync(ANCHOR_CONFIG_FILE, "utf-8");

  for (let i = 0; i < programFolders.length; i++) {
    const programFolder = programFolders[i];
    const filePath = `${PROGRAMS_FOLDER}/${programFolder}/${PROGRAM_MAIN_FILE}`;
    const programMainFileContents = readFileSync(filePath, "utf-8");
    const programAddr = keysListArray[i].split(": ")[1];
    console.log(`Program: ${programFolder}, address: ${programAddr}`);

    const programMainFileModifiedContents = programMainFileContents.replace(
      new RegExp(`${MACRO_NAME}.*`),
      `${MACRO_NAME}("${programAddr}");`
    );
    writeFileSync(filePath, programMainFileModifiedContents, "utf-8");

    const anchorConfigProgramName = programFolder.replaceAll("-", "_");
    anchorConfigContents = anchorConfigContents.replace(
      new RegExp(`${anchorConfigProgramName} = .*`),
      `${anchorConfigProgramName} = "${programAddr}"`
    );
  }

  writeFileSync(ANCHOR_CONFIG_FILE, anchorConfigContents, "utf-8");
}

main();
