import { getEnvVar } from "./utils/env.js";

export const Keys = {
    clientToken: getEnvVar('BOT_TOKEN'),
    testGuild: getEnvVar('TEST_GUILD')
} as const;

export default Keys;