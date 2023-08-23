import {inspect} from "util";
import {z as zod} from "zod";

const appConfigValidation = zod
    .object({
        NODE_STAGE: zod.string(),
        PORT: zod.number({coerce: true}),
    })
    .safeParse({
        NODE_STAGE: process.env.NODE_STAGE,
        PORT: process.env.PORT,
    });

if (appConfigValidation.success === false) {
    throw Error(`Environment variables validation error: ${appConfigValidation.error.toString()}`);
}

console.log(`Application initialized with config: ${inspect(appConfigValidation.data, false, Infinity)}`);
export const appConfig = appConfigValidation.data;
