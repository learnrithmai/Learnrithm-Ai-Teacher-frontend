/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextApiResponse } from "next";
import { z, ZodError, ZodTypeAny } from "zod";
import createError from "http-errors";
import log from "../utils/chalkLogger";

/* ***************************** Zod Utils   ********************************** */

/**
 * Creates a Zod schema for a non-empty string.
 * @param errorMap - Optional error map to override default messages.
 * @returns A Zod string schema that ensures non-empty input.
 * @example
 * const schema = stringNonEmpty().min(5);
 * schema.parse("Hello"); // Valid
 * schema.parse(""); // Throws an error
 */
export const stringNonEmpty = (errorMap?: z.ZodErrorMap): z.ZodString => {
  return z
    .string({ errorMap })
    .min(1, { message: "cannot be empty" });
};

/**
 * Custom error map for Zod validation.
 * It maps Zod issues to friendly error messages.
 */
export const errorMap = z.setErrorMap((issue, ctx) => {
  switch (issue.code) {
    case z.ZodIssueCode.invalid_type:
      if (issue.received === undefined) {
        return { message: "is required" };
      }
      return { message: `${ctx.defaultError} : ${issue.received}` };

    case z.ZodIssueCode.invalid_string:
      if (issue.validation === "url") {
        return { message: `(${ctx.data}) must be a valid URL` };
      } else if (issue.validation === "email") {
        return { message: `(${ctx.data}) must be a valid email` };
      }
      return { message: `${ctx.data} : must be a string` };

    case z.ZodIssueCode.invalid_enum_value:
      return {
        message: `${ctx.data} : is not a valid enum value. Valid options: ${issue.options?.join(" | ")}`,
      };

    case z.ZodIssueCode.too_small:
      return {
        message: `value ${ctx.data} expected to be >= ${issue.minimum}`,
      };

    case z.ZodIssueCode.too_big:
      return {
        message: `value ${ctx.data} : expected to be <= ${issue.maximum}`,
      };

    default:
      return { message: ctx.defaultError };
  }
});

/**
 * Converts a string to an array using a provided schema.
 * If the input is already an array, it is returned as is.
 * @param schema - Zod schema for array elements.
 * @param defult - Optional default value when input is neither string nor array.
 * @returns A Zod array schema that validates arrays of strings.
 * @example
 * const urlSchema = z.string().url();
 * const arraySchema = arrayFromString(urlSchema);
 * arraySchema.parse("http://example.com,https://nextjs.org");
 */
export const arrayFromString = (
  schema: z.ZodSchema,
  defult: string = ""
): z.ZodArray<z.ZodString> => {
  return z.preprocess(
    (obj) => {
      if (Array.isArray(obj)) {
        return obj;
      } else if (typeof obj === "string") {
        return obj.split(",").map((s) => s.trim());
      } else {
        return defult;
      }
    },
    z.array(schema).nonempty({ message: "array cannot be empty" })
  ) as unknown as z.ZodArray<z.ZodString>;
};

/**
 * Generates a default instance of an object based on a Zod schema.
 * @param schema - The Zod schema definition.
 * @param options - Optional settings to control default values.
 * @returns An object populated with default values for each field.
 * @example
 * const userSchema = z.object({
 *   name: z.string().default(""),
 *   age: z.number().default(0),
 * });
 * const defaultUser = defaultInstance(userSchema);
 */
export function defaultInstance<T extends ZodTypeAny>(
  schema: z.AnyZodObject | z.ZodDefault<any> | z.ZodEffects<any>,
  options: {
    defaultArrayEmpty?: boolean;
    defaultDateEmpty?: boolean;
    defaultDateUndefined?: boolean;
    defaultDateNull?: boolean;
  } = {}
): z.infer<T> {
  const defaultArrayEmpty = options.defaultArrayEmpty ?? false;
  const defaultDateEmpty = options.defaultDateEmpty ?? false;
  const defaultDateUndefined = options.defaultDateUndefined ?? false;
  const defaultDateNull = options.defaultDateNull ?? false;

  function run(): z.infer<T> {
    if (schema instanceof z.ZodEffects) {
      if (schema.innerType() instanceof z.ZodEffects) {
        return defaultInstance(schema.innerType(), options);
      }
      return defaultInstance(
        z.object(schema.innerType().shape),
        options
      );
    }

    if (schema instanceof z.ZodDefault) {
      const defValues = schema._def.defaultValue();
      const shape = schema._def.innerType._def.shape;
      const temp = Object.entries(shape).map(([key, value]) => {
        if (defValues[key] !== undefined) {
          return [key, defValues[key]];
        } else if (value instanceof z.ZodEffects || value instanceof z.ZodDefault) {
          return [key, defaultInstance(value as any, options)];
        } else {
          return [key, getDefaultValue(value as any)];
        }
      });
      return {
        ...Object.fromEntries(temp),
        ...defValues,
      };
    }

    if (schema instanceof z.ZodType) {
      const the_shape = (schema as any).shape as z.ZodAny;
      const entries = Object.entries(the_shape);
      const temp = entries.map(([key, value]) => {
        const this_default = value instanceof z.ZodEffects
          ? defaultInstance(value, options)
          : getDefaultValue(value);
        return [key, this_default];
      });
      return Object.fromEntries(temp);
    } else {
      console.error(`Error: Unable to process this schema`);
      return null as any;
    }
  }

  function getDefaultValue(dschema: ZodTypeAny): any {
    if (dschema instanceof z.ZodDefault) {
      if (!("_def" in dschema)) return undefined;
      if (!("defaultValue" in dschema._def)) return undefined;
      return dschema._def.defaultValue();
    }
    if (dschema instanceof z.ZodArray) {
      if (!("_def" in dschema)) return undefined;
      if (!("type" in dschema._def)) return undefined;
      return defaultArrayEmpty
        ? []
        : [getDefaultValue(dschema._def.type as ZodTypeAny)];
    }
    if (dschema instanceof z.ZodString) return "";
    if (dschema instanceof z.ZodNumber || dschema instanceof z.ZodBigInt) {
      return (dschema as any).minValue ?? 0;
    }
    if (dschema instanceof z.ZodDate) {
      return defaultDateEmpty
        ? ""
        : defaultDateNull
          ? null
          : defaultDateUndefined
            ? undefined
            : (dschema as z.ZodDate).minDate;
    }
    if (dschema instanceof z.ZodSymbol) return "";
    if (dschema instanceof z.ZodBoolean) return false;
    if (dschema instanceof z.ZodNull) return null;
    if (dschema instanceof z.ZodPipeline) {
      if (!("out" in dschema._def)) return undefined;
      return getDefaultValue(dschema._def.out);
    }
    if (dschema instanceof z.ZodObject) {
      return defaultInstance(dschema, options);
    }
    if (dschema instanceof z.ZodAny && !("innerType" in dschema._def))
      return undefined;
    return getDefaultValue(dschema._def.innerType);
  }

  return run();
}

/**
 * Handles errors during Zod validation.
 * If a Next.js API response is provided, it sends a 400 response with details.
 * Otherwise, it logs the error and throws an HTTP error.
 *
 * @param error - The error encountered during validation.
 * @param res - (Optional) Next.js API response.
 */
export function handleZodError(error: unknown, res?: NextApiResponse): void {
  if (error instanceof ZodError) {
    if (res) {
      res.status(400).json({
        message: "Validation error",
        errors: error.errors,
      });
    } else {
      log.info(
        "\n 💠💠💠 Environment variable validation error 💠💠💠\n"
      );
      error.errors.forEach((err) => {
        const currentPath = formatPath(err.path);
        log.error(`* ${currentPath}  : `, `${err.message}`);
      });
      throw createError(500, "Environment variable validation error");
    }
  } else {
    log.error(
      "An unexpected server error occurred during Zod validation: \n",
      error as string
    );
    throw createError(500, "Unexpected error", { error });
  }
}

/**
 * Formats a Zod error path array into a string representation.
 *
 * @param path - Array of strings or numbers representing the error path.
 * @returns A formatted string representation of the path.
 */
export function formatPath(path: Array<string | number>): string {
  if (!Array.isArray(path) || path.length === 0) {
    throw new Error("Path must be a non-empty array");
  }

  return path
    .map((element, index) => {
      if (
        Number.isInteger(element) &&
        index > 0 &&
        Number.isInteger(path[index - 1])
      ) {
        return `[${element}]`;
      } else {
        return element.toString();
      }
    })
    .join(".");
}