import { useForm } from "react-hook-form";
import "../StopsMap/StopsMap.css";
export default function EventForm({ onSubmit }) {
  const { register, handleSubmit } = useForm();

  

  return (
    <div className="stops-panel">
      <form onSubmit={handleSubmit(onSubmit)} className="event-form card">
        <h3 className="form-title">📍 Datos del evento</h3>

        <div className="form-group">
          <label>Título</label>
          <input {...register("title", { required: true })} />
        </div>

        <div className="form-group">
          <label>Descripción</label>
          <textarea {...register("description")} />
        </div>

        <div className="form-grid">
          <div className="form-group">
            <label>Fecha</label>
            <input type="date" {...register("date", { required: true })} />
          </div>

          <div className="form-group">
            <label>Hora de salida</label>
            <input
  type="time"
  {...register("departTime", { required: true })}
/>


          </div>
        </div>

        <div className="form-group">
          <label>Punto de encuentro</label>
          <input {...register("meetingAddress")} />
        </div>
        <div className="form-group">
          <label>Imagen del evento</label>
          <input type="file" {...register("images")} />
        </div>

        <button type="submit" className="btn-primary">
          Crear evento
        </button>
      </form>
      
    </div>
  );
}
