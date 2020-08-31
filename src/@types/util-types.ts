export type BuildEnvironment = {
  readonly [key: string]: string;
};

export const buildEnvironment: BuildEnvironment = {
  DEV: "development",
  TEST: "test",
  PROD: "production",
};
