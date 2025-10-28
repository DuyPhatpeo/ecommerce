// src/hooks/useAppConfig.ts
export type ViewMode = "slider" | "grid";

interface AppConfig {
  viewModeDefault: ViewMode;
}

const DEFAULT_CONFIG: AppConfig = {
  viewModeDefault: "slider",
};

export function normalizeViewMode(value: any): ViewMode {
  const val = String(value ?? "")
    .toLowerCase()
    .trim();

  if (["true", "1", "slider"].includes(val)) return "slider";
  if (["false", "0", "grid"].includes(val)) return "grid";

  return DEFAULT_CONFIG.viewModeDefault;
}

export function useAppConfig(remoteConfig?: Record<string, any>) {
  const nestedViewMode =
    remoteConfig?.viewMode ??
    Object.values(remoteConfig?.sectionOrder ?? {}).find(
      (v: any) => v?.props?.viewMode
    )?.props?.viewMode;

  const normalizedViewMode = normalizeViewMode(nestedViewMode);

  return {
    ...DEFAULT_CONFIG,
    viewModeDefault: normalizedViewMode,
    normalizeViewMode, // ✅ export thêm để xài ở component
  };
}
