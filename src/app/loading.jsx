import Loader from "./components/loader/Loader";

export default function Loading() {
  return (
    <div className="section">
      <div className="loading">
        <div className="loader"></div>
        <Loader message="Cargando"></Loader>
      </div>
    </div>
  );
}