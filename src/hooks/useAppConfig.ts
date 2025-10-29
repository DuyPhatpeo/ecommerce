// src/hooks/useAppConfig.ts
export type mode = "slider" | "grid";

interface AppConfig {
  modeDefault: mode;
}

const DEFAULT_CONFIG: AppConfig = {
  modeDefault: "slider",
};

export function normalizemode(value: any): mode {
  const val = String(value ?? "")
    .toLowerCase()
    .trim();

  if (["true", "1", "slider"].includes(val)) return "slider";
  if (["false", "0", "grid"].includes(val)) return "grid";

  return DEFAULT_CONFIG.modeDefault;
}

export function useAppConfig(remoteConfig?: Record<string, any>) {
  const nestedmode =
    remoteConfig?.mode ??
    Object.values(remoteConfig?.sectionOrder ?? {}).find(
      (v): v is { props?: { mode?: any } } =>
        !!v && typeof v === "object" && "props" in v
    )?.props?.mode;

  const normalizedmode = normalizemode(nestedmode);

  return {
    ...DEFAULT_CONFIG,
    modeDefault: normalizedmode,
    normalizemode,
  };
}
