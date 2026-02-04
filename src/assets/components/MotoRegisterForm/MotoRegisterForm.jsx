import { useForm } from "react-hook-form";

export default function MotoRegisterForm({ onBack, onSubmitFinal, loading }) {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();

  return (
    <form className="form" onSubmit={handleSubmit(onSubmitFinal)}>

      {/* Marca */}
      <div className="form-group">
        <label>Marca *</label>
        <input
          type="text"
          {...register("brand", { required: "La marca es obligatoria" })}
        />
        {errors.brand && <span className="error">{errors.brand.message}</span>}
      </div>

      {/* Modelo */}
      <div className="form-group">
        <label>Modelo *</label>
        <input
          type="text"
          {...register("model", { required: "El modelo es obligatorio" })}
        />
        {errors.model && <span className="error">{errors.model.message}</span>}
      </div>

      {/* Año + Cilindrada */}
      <div className="form-row">
        <div className="form-group">
          <label>Año *</label>
          <input
            type="number"
            {...register("year", {
              required: "El año es obligatorio",
              min: { value: 1900, message: "Año inválido" }
            })}
          />
          {errors.year && <span className="error">{errors.year.message}</span>}
        </div>

        <div className="form-group">
          <label>Cilindrada (cc) *</label>
          <input
            type="text"
            {...register("displacementCc", {
              required: "La cilindrada es obligatoria"
            })}
          />
          {errors.displacementCc && (
            <span className="error">{errors.displacementCc.message}</span>
          )}
        </div>
      </div>

      {/* Patente + Color */}
      <div className="form-row">
        <div className="form-group">
          <label>Patente *</label>
          <input
            type="text"
            {...register("plate", { required: "La patente es obligatoria" })}
          />
          {errors.plate && <span className="error">{errors.plate.message}</span>}
        </div>

        <div className="form-group">
          <label>Color *</label>
          <input
            type="text"
            {...register("color", { required: "El color es obligatorio" })}
          />
          {errors.color && <span className="error">{errors.color.message}</span>}
        </div>
      </div>

      {/* Foto moto */}
      <div className="form-group">
        <label>Foto de la moto *</label>
        <input
          type="file"
          accept="image/*"
          {...register("image", { required: "La imagen es obligatoria" })}
        />
        {errors.image && <span className="error">{errors.image.message}</span>}
      </div>

      {/* Botones */}
      <div className="form-actions">
        <button type="button" className="btn-secondary" onClick={onBack}>
          Volver
        </button>

        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? "Registrando..." : "Finalizar registro"}
        </button>
      </div>
    </form>
  );
}
