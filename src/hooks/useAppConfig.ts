// src/hooks/useAppConfig.ts
export type ViewMode = "slider" | "list";

interface AppConfig {
  viewModeDefault: ViewMode;
}

const DEFAULT_CONFIG: AppConfig = {
  viewModeDefault: "slider",
};

function normalizeViewMode(value: any): ViewMode {
  // ép kiểu để so sánh an toàn
  const val = String(value).toLowerCase().trim();

  // Các trường hợp tương đương "slider"
  if (val === "true" || val === "1" || val === "slider") return "slider";

  // Các trường hợp tương đương "list"
  if (val === "false" || val === "0" || val === "list") return "list";

  // fallback về mặc định
  return DEFAULT_CONFIG.viewModeDefault;
}

export function useAppConfig(remoteConfig?: Record<string, any>) {
  const normalizedViewMode = normalizeViewMode(remoteConfig?.viewMode);
  return {
    ...DEFAULT_CONFIG,
    viewModeDefault: normalizedViewMode,
  };
}
