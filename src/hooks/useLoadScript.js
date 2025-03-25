import { useEffect } from "react";

export default function useLoadScript(scripts = [], callback = () => {}) {
  useEffect(() => {
    if (!scripts.length) return;

    let loadedCount = 0;

    scripts.forEach((src) => {
      if (!src) return;

      const existingScript = document.querySelector(`script[src="${src}"]`);
      if (existingScript) {
        loadedCount++;
        if (loadedCount === scripts.length) callback();
        return;
      }

      const script = document.createElement("script");
      script.src = src;
      script.async = true;
      script.defer = true;
      script.onload = () => {
        console.log(`✅ Script berhasil dimuat: ${src}`);
        loadedCount++;
        if (loadedCount === scripts.length) callback();
      };
      script.onerror = () => console.error(`❌ Gagal memuat script: ${src}`);

      document.body.appendChild(script);
    });
  }, [scripts, callback]);
}