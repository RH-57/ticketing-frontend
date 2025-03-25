import AppRoutes from './routes'
import useLoadScript from './hooks/useLoadScript'

export default function App() {
  const scripts = [
    "/assets/vendors/js/vendor.bundle.base.js",
    "/assets/vendors/chart.js/Chart.min.js",
    "/assets/vendors/progressbar.js/progressbar.min.js",
    "/assets/vendors/jvectormap/jquery-jvectormap.min.js",
    "/assets/vendors/jvectormap/jquery-jvectormap-world-mill-en.js",
    "/assets/vendors/owl-carousel-2/owl.carousel.min.js",
    "/assets/vendors/select2/select2.min.js",
    "/assets/js/off-canvas.js",
    "/assets/js/hoverable-collapse.js",
    "/assets/js/todolist.js",
    "/assets/js/misc.js",
    "/assets/js/settings.js",
    "/assets/js/dashboard.js",
    "/assets/js/select2.js",
  ];

  console.log("Memuat script eksternal...");
  useLoadScript(scripts, () => {
    console.log("🔄 Mengeksekusi ulang fungsi sidebar...");
    if (window.initializeSidebar) {
      window.initializeSidebar()
    }
  })

  
  return (
    <div>
      <AppRoutes />
    </div>
  )
}