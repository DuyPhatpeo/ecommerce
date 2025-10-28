// src/components/home/MainHome.tsx
import Banner from "./Banner";
import Features from "./Features";
import Promo from "./Promo";
import HotDeal from "./HotDeal";
import BrandStrip from "./BrandStrip";
import ProductView from "./ProductView";
import { useAppConfig } from "../../hooks/useAppConfig";

const MainHome = () => {
  // 🧩 Giả lập config backend (mỗi ProductView kiểu khác nhau)
  const remoteConfig = {
    sectionOrder: {
      Features: { order: 1 },
      ProductView_1: {
        order: 2,
        props: { viewMode: "slider", status: "latest" },
      },
      ProductView_2: {
        order: 3,
        props: { viewMode: "list", status: "coming" },
      },
      Promo: { order: 4 },

      HotDeal: { order: 6 },
      BrandStrip: { order: 7 },
    },
  };

  // ⚙️ Hook xử lý config viewMode (fallback khi thiếu)
  const { viewModeDefault } = useAppConfig(remoteConfig);

  // 🧱 Map component gốc
  const sectionMap: Record<string, (props?: any) => JSX.Element> = {
    Features: () => <Features />,
    Promo: () => <Promo />,
    ProductView: (props) => (
      <ProductView viewMode={viewModeDefault} {...props} />
    ),
    HotDeal: () => <HotDeal />,
    BrandStrip: () => <BrandStrip />,
  };

  // 🧮 Chuẩn hóa danh sách section có thể trùng tên
  const sortedSections = Object.entries(remoteConfig?.sectionOrder ?? {})
    .map(([key, cfg]) => ({
      key,
      baseKey: key.split("_")[0], // tách phần gốc: "ProductView_1" -> "ProductView"
      order:
        typeof cfg === "object" && "order" in cfg ? cfg.order : Number(cfg),
      props: typeof cfg === "object" && "props" in cfg ? cfg.props : undefined,
    }))
    .sort((a, b) => Number(a.order) - Number(b.order))
    .filter(({ baseKey }) => baseKey in sectionMap);

  // 🎨 Render layout
  return (
    <>
      <Banner />
      {sortedSections.map(({ key, baseKey, props }) => {
        const Section = sectionMap[baseKey];
        return (
          <section key={key}>
            <Section {...props} />
          </section>
        );
      })}
    </>
  );
};

export default MainHome;
