// Generated Convex values
export const v = {
  string: () => 'string',
  number: () => 'number',
  boolean: () => 'boolean',
  literal: (value: any) => value,
  union: (...types: any[]) => types[0],
  optional: () => undefined,
  array: (type: any) => [type],
  object: (schema: any) => schema,
  id: (table: string) => `id_${table}`,
  any: () => 'any'
};
