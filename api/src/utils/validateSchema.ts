import * as yup from "yup";
import { createYupSchema, YupSchema } from "./createYupSchema";

export async function validateSchema(
  obj: YupSchema,
  data: any,
): Promise<(yup.ValidationError | null)[]> {
  const schema = createYupSchema(obj);

  try {
    await schema.validate(data);

    return [null];
  } catch (err) {
    return [err as yup.ValidationError];
  }
}
